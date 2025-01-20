from flask import Blueprint, g, jsonify
from werkzeug.exceptions import Unauthorized
from app.web.hooks import login_required, handle_file_upload, load_model
from app.web.db.models import Pdf
from app.web.tasks.embeddings import process_document
from app.web import files
from app.chat import run_background_llm_process, ChatArgs

bp = Blueprint("pdf", __name__, url_prefix="/api/pdfs")


@bp.route("/", methods=["GET"])
@login_required
def list():
    """
    List all PDFs for the current logged-in user.
    """
    pdfs = Pdf.where(user_id=g.user.id)

    return Pdf.as_dicts(pdfs)


@bp.route("/", methods=["POST"])
@login_required
@handle_file_upload
def upload_file(file_id, file_path, file_name):
    """
    Upload a new PDF file, process it, and record it in the database.
    """
    res, status_code = files.upload(file_path)
    if status_code >= 400:
        return res, status_code

    pdf = Pdf.create(id=file_id, name=file_name, user_id=g.user.id)

    process_document.delay(pdf.id)

    return pdf.as_dict()


@bp.route("/<string:pdf_id>", methods=["GET"])
@login_required
@load_model(Pdf)
def show(pdf):
    """
    Return the details of the specified PDF.
    """
    return jsonify(
        {
            "pdf": pdf.as_dict(),
            "download_url": files.create_download_url(pdf.id),
        }
    )


@bp.route("/<string:pdf_id>/json-analyze", methods=["POST"])
@login_required
@load_model(Pdf)
def analyze_pdf(pdf):
    # TODO: Implement the LLM process
    prompt = "Analyze this PDF and return JSON in the format {\"name\":..., ...}"

    chat_args = ChatArgs(
        pdf_id=pdf.id,
        metadata={
            "user_id": g.user.id,
            "pdf_id": pdf.id,
        },
    )

    output = run_background_llm_process(chat_args, prompt)
    pdf.analyzed_data = output
    pdf.save()
    return pdf.as_dict()


@bp.route("/<string:pdf_id>/sla-json", methods=["GET"])
@login_required
@load_model(Pdf)
def get_analysis(pdf):
    return jsonify({"analysis": pdf.analyzed_data})
