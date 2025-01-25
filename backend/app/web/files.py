import json
import os
import re
import json
import time
import requests
import tempfile
from typing import Tuple, Dict, Any
from app.web.config import Config
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage
from app.chat.vector_stores.pinecone import vector_store

upload_url = f"{Config.UPLOAD_URL}/upload"


def upload(local_file_path: str) -> Tuple[Dict[str, str], int]:
    with open(local_file_path, "rb") as f:
        response = requests.post(upload_url, files={"file": f})
        return json.loads(response.text), response.status_code


def create_download_url(file_id):
    return f"{Config.UPLOAD_URL}/download/{file_id}"


def download(file_id):
    return _Download(file_id)

# Function to extract values using regex


def extract_json_values(json_string):
    pattern = re.compile(r'"([^"]*)":\s*"([^"]*)"')
    matches = pattern.findall(json_string)

    # Creating dictionary from matches
    extracted_data = {match[0]: match[1] for match in matches}
    return extracted_data


def extract_pdf_data(pdf_id: str) -> dict:
    time.sleep(2)
    # Fetch up to 1000 chunks from Pinecone
    new_results = vector_store.similarity_search(
        query="",
        filter={"pdf_id": pdf_id},
        k=1000
    )
    if not new_results:
        return {}

    # Process chunks in groups of 10
    chunk_size = 10
    results = []
    for i in range(0, len(new_results), chunk_size):
        chunk = new_results[i:i+chunk_size]
        text = "\n".join([doc.page_content for doc in chunk])
        res = get_llm_response(text)
        if res:
            results.append(res)
    return extract_json_from_string(format_json_dump(json.dumps(results)))


def extract_json_from_string(string):
    # Regex pattern to match JSON data
    try:
        pattern = re.compile(r'```json\n(.*?)\n```', re.DOTALL)
        matches = pattern.findall(string)

        if matches:
            json_data = matches[0]
            return json.loads(json_data)
        else:
            return string
    except Exception as e:
        print(f"Error: {e}")
        return string


def format_json_dump(string):
    prompt = f"""Can properly format this json text? strictly response JSON only:

    text: {string}
"""
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0)

    # Get response
    messages = [HumanMessage(content=prompt)]
    response = llm.invoke(messages)
    try:
        if response.content.__contains__("unable to analyze") or response.content.__contains__("sorry"):
            return extract_json_values(response.content)
        else:
            print(response.content)
            return response.content
    except:
        return {"error": "Failed to extract data"}


def get_llm_response(text: str) -> str:
    # Create extraction prompt with proper string formatting
    prompt = f"""Analyze below SLA doc text and extract key information about Service Level Agreements (SLAs) and Key Performance Indicators (KPIs). For each SLA information found, trictly response (JSON only) with factual informations:
SLA Name,
Parties Involved,
System Concerned,
Description,
Associated Metrics,
Page Number in the PDF (if found)
Example:
[{{"SLA Name": "AWS Managed Services Service Level Agreement",
    "Parties Involved": "AWS and AWS Managed Services customers",
    "System Concerned": "AWS Managed Services (AMS)",
    "Description": "This SLA governs the use of AWS Managed Services, including AMS Advanced and AMS Accelerate. It outlines service commitments and credit eligibility for service level failures.",
    "Page Number": 55,
    "Associated Metrics": [
        "Incident Response Time",
        "Incident Restoration/Resolution Time",
        "AWS Console/API Availability",
        "Patch Management",
        "Environment Recovery Initiation Time"
    ]
}},
{{
    "SLA Name": "Test Effectiveness",
    "Parties Involved": "Citizens Bank, N.A. and Infosys Limited",
    "System Concerned": "Application Development Testing",
    "Description": "Measures the degree to which Defects are detected and removed prior to release into the Production environment.",
    "Associated Metrics": "100 - (100*((Number of Defects found in Production phase during Warranty Period)/(Number of Defects found in testing+Number of Defects found in Production phase during Warranty Period)))",
    "Page Number": 55
}}]
PDF Content:
{text}"""
    # Initialize LLM with correct model name
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0)

    # Get response
    messages = [HumanMessage(content=prompt)]
    response = llm.invoke(messages)
    try:
        if not (response.content.__contains__("unable to analyze") or response.content.__contains__("sorry")):
            return extract_json_values(response.content)
        else:
            return response.content
    except:
        return {"error": "Failed to extract data"}


class _Download:
    def __init__(self, file_id):
        self.file_id = file_id
        self.temp_dir = tempfile.TemporaryDirectory()
        self.file_path = ""

    def download(self):
        self.file_path = os.path.join(self.temp_dir.name, self.file_id)
        response = requests.get(create_download_url(self.file_id), stream=True)
        with open(self.file_path, "wb") as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)

        return self.file_path

    def cleanup(self):
        self.temp_dir.cleanup()

    def __enter__(self):
        return self.download()

    def __exit__(self, exc, value, tb):
        self.cleanup()
        return False
