import os
from langchain_pinecone import PineconeVectorStore
from app.chat.embeddings.openai import embeddings

vector_store = PineconeVectorStore(
    pinecone_api_key=os.getenv("PINECONE_API_KEY"),
    index=os.getenv("PINECONE_INDEX_NAME"), 
    embedding=embeddings
)

def build_retriever(chat_args, k):
    search_kwargs = {
        "filter": { "pdf_id": chat_args.pdf_id },
        "k": k
    }
    return vector_store.as_retriever(
        search_kwargs=search_kwargs
    )