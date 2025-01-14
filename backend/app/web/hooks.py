import functools
import tempfile
import uuid
import os
import logging
from flask import g, session, request
from sqlalchemy.exc import IntegrityError, NoResultFound
from werkzeug.exceptions import Unauthorized, BadRequest
from app.web.db.models import User, Model


def load_model(Model: Model, extract_id_lambda=None):
    """
    Decorator to load a model instance based on the provided model ID.
    The model ID can be extracted from the request using an optional lambda function.
    If the model instance does not belong to the current user, an Unauthorized exception is raised.
    """
    def decorator(view):
        @functools.wraps(view)
        def wrapped_view(**kwargs):
            model_name = Model.__name__.lower()
            model_id_name = f"{model_name}_id"

            model_id = kwargs.get(model_id_name)
            if extract_id_lambda:
                model_id = extract_id_lambda(request)

            if not model_id:
                raise ValueError(f"{model_id_name} must be provided in the request.")

            instance = Model.find_by(id=model_id)

            if instance.user_id != g.user.id:
                raise Unauthorized("You are not authorized to view this.")

            if model_id_name in kwargs:
                del kwargs[model_id_name]
            kwargs[model_name] = instance
            return view(**kwargs)

        return wrapped_view

    return decorator


def login_required(view):
    """
    Decorator to ensure that the user is logged in before accessing the view.
    If the user is not logged in, an Unauthorized exception is raised.
    """
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        return view(**kwargs)

    return wrapped_view


def add_headers(response):
    """
    Add custom headers to the response.
    """
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response


def load_logged_in_user():
    """
    Load the logged-in user from the session and set it in the global context (g).
    """
    user_id = session.get("user_id")

    if user_id is None:
        g.user = None
    else:
        try:
            g.user = User.find_by(id=user_id)
        except Exception:
            g.user = None


def handle_file_upload(fn):
    """
    Decorator to handle file uploads. It saves the uploaded file to a temporary directory,
    generates a unique file ID, and passes the file information to the view.
    """
    @functools.wraps(fn)
    def wrapped(*args, **kwargs):
        file = request.files["file"]
        file_id = str(uuid.uuid4())

        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = os.path.join(temp_dir, file_id)
            file.save(file_path)

            kwargs["file_id"] = file_id
            kwargs["file_path"] = file_path
            kwargs["file_name"] = file.filename
            return fn(*args, **kwargs)

    return wrapped


def handle_error(err):
    """
    Global error handler to log the error and return a JSON response with the error message.
    """
    if isinstance(err, IntegrityError):
        logging.error(err)
        return {"message": "In use"}, 400
    elif isinstance(err, NoResultFound):
        logging.error(err)
        return {"message": "Not found"}, 404
    elif isinstance(err, Unauthorized):
        logging.error(err)
        return {"message": err.description}, 401
    elif isinstance(err, BadRequest):
        logging.error(err)
        return {"message": err.description}, 401

    raise err
