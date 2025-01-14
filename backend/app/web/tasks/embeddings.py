from celery import shared_task

from app.web.db.models import Pdf
from app.web.files import download
from app.chat import create_embeddings_for_pdf


@shared_task()
def process_document(pdf_id: int):
    """
    Celery task to process a PDF document by downloading it and 
    creating embeddings for it.
    
    Args:
        pdf_id (int): The ID of the PDF to process.
    """
    pdf = Pdf.find_by(id=pdf_id)
    with download(pdf.id) as pdf_path:
        create_embeddings_for_pdf(pdf.id, pdf_path)
