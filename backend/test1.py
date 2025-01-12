import os
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set your API key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    api_key = getpass.getpass("Enter your Google AI API key: ")
    os.environ["GOOGLE_API_KEY"] = api_key

# Instantiate the model
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

# Generate a chat completion
message = llm.invoke("Hello, how are you?")
print(message)
