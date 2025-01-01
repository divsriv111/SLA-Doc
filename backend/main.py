import os
import openai
from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
from typing import List, Dict, Tuple
import numpy as np
from tenacity import retry, wait_random_exponential, stop_after_attempt
import tiktoken
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor
import logging
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
print(f"Loading environment variables from: {env_path}")
if not load_dotenv(env_path):
    raise RuntimeError("Failed to load .env file")

# LM Studio Configuration
LM_STUDIO_BASE_URL = "http://localhost:1234/v1"
USE_LM_STUDIO = os.getenv('USE_LM_STUDIO', 'true').lower() == 'true'

if USE_LM_STUDIO:
    openai.api_base = LM_STUDIO_BASE_URL
    openai.api_key = "not-needed"  # LM Studio doesn't require API key

# Optional: For vector storage
try:
    import chromadb
    from chromadb.config import Settings
    VECTOR_DB_ENABLED = True
except ImportError:
    VECTOR_DB_ENABLED = False

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
CHUNK_SIZE = 3  # Number of pages per chunk
MAX_TOKENS = 4000  # Max tokens per API call
GPT_MODEL = "gpt-3.5-turbo"  # or "gpt-4" for better accuracy


@dataclass
class TextChunk:
    """Represents a chunk of text with page tracking"""
    text: str
    start_page: int
    end_page: int
    tokens: int


class SLAAnalyzer:
    def __init__(self):
        self.tokenizer = tiktoken.get_encoding("cl100k_base")

        # Configure API based on environment
        if USE_LM_STUDIO:
            self.openai_api_key = "not-needed"
            openai.api_base = LM_STUDIO_BASE_URL
        else:
            self.openai_api_key = os.getenv('OPENAI_API_KEY')
            if not self.openai_api_key:
                raise ValueError("OPENAI_API_KEY not found in .env file")
            openai.api_key = self.openai_api_key

        # Initialize ChromaDB if available
        if VECTOR_DB_ENABLED:
            persist_directory = Path(__file__).parent / "vector_db"
            self.chroma_client = chromadb.PersistentClient(
                path=str(persist_directory),
                settings=Settings(
                    anonymized_telemetry=False
                )
            )
            self.collection = self.chroma_client.get_or_create_collection(
                name="sla_documents",
                metadata={"hnsw:space": "cosine"}
            )

    def create_chunks(self, pages: List[Tuple[int, str]]) -> List[TextChunk]:
        """Split pages into manageable chunks while tracking page numbers"""
        chunks = []
        current_chunk = []
        current_tokens = 0
        chunk_start_page = 1

        for page_num, text in pages:
            page_tokens = len(self.tokenizer.encode(text))

            if current_tokens + page_tokens > MAX_TOKENS or len(current_chunk) >= CHUNK_SIZE:
                # Save current chunk
                if current_chunk:
                    chunks.append(TextChunk(
                        text="\n".join(current_chunk),
                        start_page=chunk_start_page,
                        end_page=page_num - 1,
                        tokens=current_tokens
                    ))
                # Start new chunk
                current_chunk = [text]
                current_tokens = page_tokens
                chunk_start_page = page_num
            else:
                current_chunk.append(text)
                current_tokens += page_tokens

        # Add final chunk
        if current_chunk:
            chunks.append(TextChunk(
                text="\n".join(current_chunk),
                start_page=chunk_start_page,
                end_page=pages[-1][0],
                tokens=current_tokens
            ))

        return chunks

    @retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(3))
    def analyze_chunk(self, chunk: TextChunk) -> Dict:
        """Analyze a single chunk of text"""
        try:
            messages = [{
                "role": "system",
                "content": "You are a contract analysis assistant. Extract key SLA information."
            }, {
                "role": "user",
                "content": f"""
                Analyze pages {chunk.start_page}-{chunk.end_page} of the SLA and extract:
                - SLA Name
                - Parties Involved
                - System Concerned
                - Description
                - Metrics
                
                Text: {chunk.text}
                
                Return JSON only.
                """
            }]

            # Adjust parameters for LM Studio compatibility
            response = openai.ChatCompletion.create(
                model="local-model",  # LM Studio uses this as default
                messages=messages,
                temperature=0,
                stream=False  # Ensure streaming is disabled for LM Studio
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error analyzing chunk: {str(e)}")
            raise

    def store_in_vector_db(self, file_id: str, chunks: List[TextChunk]):
        """Store chunk embeddings in vector DB"""
        if not VECTOR_DB_ENABLED:
            return

        embeddings = []
        texts = []
        metadatas = []
        ids = []

        for i, chunk in enumerate(chunks):
            embedding = openai.Embedding.create(
                input=chunk.text,
                model="text-embedding-ada-002"
            )

            chunk_id = f"{file_id}_chunk_{i}"
            ids.append(chunk_id)
            embeddings.append(embedding.data[0].embedding)
            texts.append(chunk.text)
            metadatas.append({
                'start_page': chunk.start_page,
                'end_page': chunk.end_page,
                'file_id': file_id
            })

        self.collection.add(
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )

    def search_similar_chunks(self, query: str, limit: int = 5):
        """Search for similar chunks using vector similarity"""
        if not VECTOR_DB_ENABLED:
            return []

        query_embedding = openai.Embedding.create(
            input=query,
            model="text-embedding-ada-002"
        )

        results = self.collection.query(
            query_embeddings=[query_embedding.data[0].embedding],
            n_results=limit
        )

        return results


def extract_text_with_page_numbers(filepath: str) -> List[Tuple[int, str]]:
    """Extract text from PDF with page tracking"""
    try:
        pdf_reader = PdfReader(filepath)
        return [(i + 1, page.extract_text()) for i, page in enumerate(pdf_reader.pages)]
    except Exception as e:
        logger.error(f"Error extracting PDF text: {str(e)}")
        raise


@app.route('/api/upload/extract', methods=['POST'])
def extract_sla_data():
    try:
        results = []
        uploaded_files = request.files.getlist('files')
        analyzer = SLAAnalyzer()

        for file in uploaded_files:
            try:
                # Save file temporarily
                filepath = os.path.join('/tmp', file.filename)
                file.save(filepath)

                # Extract text with page numbers
                pages = extract_text_with_page_numbers(filepath)

                # Create chunks
                chunks = analyzer.create_chunks(pages)

                # Optional: Store in vector DB
                file_id = os.path.splitext(file.filename)[0]
                analyzer.store_in_vector_db(file_id, chunks)

                # Analyze chunks in parallel
                chunk_results = []
                with ThreadPoolExecutor() as executor:
                    chunk_results = list(executor.map(
                        analyzer.analyze_chunk, chunks))

                # Combine results
                combined_result = {
                    'filename': file.filename,
                    'analysis': chunk_results,
                    'total_pages': len(pages)
                }
                results.append(combined_result)

                # Cleanup
                os.remove(filepath)

            except Exception as e:
                logger.error(
                    f"Error processing file {file.filename}: {str(e)}")
                results.append({
                    'filename': file.filename,
                    'error': str(e)
                })

        return jsonify(results), 200

    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(debug=False, port=5000)
