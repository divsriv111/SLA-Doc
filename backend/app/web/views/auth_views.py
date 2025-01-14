from flask import Blueprint, g, request, session, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from app.web.db.models import User

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.route("/user", methods=["GET"])
def get_user():
    """
    Retrieve the currently authenticated user based on the session 
    and global context (g.user), returning the user's information 
    as a dictionary or None.
    """
    if g.user is not None:
        return g.user.as_dict()

    return jsonify(None)


@bp.route("/signup", methods=["POST"])
def signup():
    """
    Sign up a new user by creating a record in the User model with an 
    email and a hashed password, then store the user ID in the session 
    and return the new user's data.
    """
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.create(email=email, password=generate_password_hash(password))
    session["user_id"] = user.id

    return user.as_dict()


@bp.route("/signin", methods=["POST"])
def signin():
    """
    Sign in an existing user by validating their email and password 
    against a stored hash, setting the user in the session if valid, 
    and returning the user's data or indicating an error if invalid.
    """
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.find_by(email=email)

    if not check_password_hash(user.password, password):
        return {"message": "Incorrect password."}, 400

    session.permanent = True
    session["user_id"] = user.id

    return user.as_dict()


@bp.route("/signout", methods=["POST"])
def signout():
    session.clear()
    return {"message": "Successfully logged out."}
