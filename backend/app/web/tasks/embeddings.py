from celery import shared_task

from app.web.db.models import Pdf
from app.web.files import download, extract_pdf_data
from app.chat import create_embeddings_for_pdf


@shared_task()
def process_document(pdf_id: int, extract_data: bool = True):
    pdf = Pdf.find_by(id=pdf_id)
    with download(pdf.id) as pdf_path:
        # Create embeddings
        create_embeddings_for_pdf(pdf.id, pdf_path)

        # Optionally extract data
        if extract_data:
            extracted_data = extract_pdf_data(pdf_path)
            pdf.update(extracted_data=extracted_data)
