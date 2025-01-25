from flask import Blueprint, g, jsonify, request
from werkzeug.exceptions import Unauthorized
from app.web.hooks import login_required, handle_file_upload, load_model, load_group
from app.web.db import db
from app.web.db.models import Pdf
from app.web.db.models import Group
from app.web.tasks.embeddings import process_document
from app.web import files
import uuid
import json

bp = Blueprint("pdf", __name__, url_prefix="/api/pdfs")


@bp.route("/", methods=["GET"])
@login_required
def list():
    pdfs = Pdf.where(user_id=g.user.id)

    return Pdf.as_dicts(pdfs)


@bp.route("/", methods=["POST"])
@login_required
@handle_file_upload
def upload_file(file_id, file_path, file_name):
    group_id = request.form.get('group_id')
    group_title = request.form.get('group_title')
    if group_id:
        # Ensure the query filters by both group_id and user_id
        group = Group.query.filter_by(id=group_id, user_id=g.user.id).first()
    else:
        # Create a new group if not found
        group_id = str(uuid.uuid4())
        group = Group(id=group_id, title=group_title, user_id=g.user.id)
        db.session.add(group)
        db.session.commit()
        print("Group not found, creating a new one - " +
              group_title + " - " + group_id + " - " + g.user.id)

    res, status_code = files.upload(file_path)
    if status_code >= 400:
        return res, status_code

    pdf = Pdf.create(id=file_id, name=file_name,
                     user_id=g.user.id, group_id=group.id)

    process_document.delay(pdf.id)

    return pdf.as_dict()


@bp.route("/<string:pdf_id>", methods=["GET"])
@login_required
@load_model(Pdf)
def show(pdf):
    group = pdf.group
    return jsonify(
        {
            "pdf": pdf.as_dict(),
            "download_url": files.create_download_url(pdf.id),
            "group": {
                "id": group.id,
                "title": group.title,
                "user_id": group.user_id,
            }
        }
    )


@bp.route("/groups", methods=["GET"])
@login_required
def list_groups():
    groups = Group.query.filter_by(user_id=g.user.id).all()
    return jsonify([group.as_dict() for group in groups])


@bp.route("/<string:pdf_id>/extract", methods=["POST"])
@login_required
@load_model(Pdf)
def extract_data(pdf):
    # Check if data is already extracted
    # if pdf.extracted_data:
    #     if not (pdf.extracted_data.__contains__("unable to analyze") or pdf.extracted_data.__contains__("sorry")):
    #         return jsonify(pdf.extracted_data)

    # Extract data using existing chunks from Pinecone
    extracted_data = files.extract_pdf_data(pdf.id)

    # Save extracted data
    pdf.extracted_data = json.dumps(extracted_data)
    pdf.save()

    return jsonify(extracted_data)
