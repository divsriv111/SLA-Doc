import os
from langchain_pinecone import PineconeVectorStore
from app.chat.embeddings.openai import embeddings

# Initialize the Pinecone vector store with API key and index name from environment variables
vector_store = PineconeVectorStore(
    pinecone_api_key=os.getenv("PINECONE_API_KEY"),
    index=os.getenv("PINECONE_INDEX_NAME"), 
    embedding=embeddings
)

def build_retriever(chat_args, k):
    """
    Build a retriever for the chat session using the Pinecone vector store.
    
    Args:
        chat_args: Arguments containing the configuration for the chat session.
        k (int): The number of top results to retrieve.
    
    Returns:
        Retriever: An instance of the retriever configured with the specified search parameters.
    """
    search_kwargs = {
        "filter": { "pdf_id": chat_args.pdf_id },
        "k": k
    }
    return vector_store.as_retriever(
        search_kwargs=search_kwargs
    )