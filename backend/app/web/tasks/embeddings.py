from celery import shared_task
import time
import threading

from app.web.db.models import Pdf
from app.web.files import download, extract_pdf_data
from app.chat import create_embeddings_for_pdf


def extract_and_update(pdf_path, pdf):
    extracted_data = extract_pdf_data(pdf_path)
    pdf.update(extracted_data=extracted_data)


@shared_task()
def process_document(pdf_id: int, extract_data: bool = False):
    pdf = Pdf.find_by(id=pdf_id)
    with download(pdf.id) as pdf_path:
        # Create embeddings
        create_embeddings_for_pdf(pdf.id, pdf_path)

        # Optionally extract data
        if extract_data:
            extract_and_update(pdf_path, pdf)
