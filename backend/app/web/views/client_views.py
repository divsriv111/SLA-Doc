import os
from flask import Blueprint, send_from_directory, current_app

bp = Blueprint(
    "client",
    __name__,
)


@bp.route("/", defaults={"path": ""})
@bp.route("/<path:path>")
def catch_all(path):
    """
    Serve static files from the configured static folder. If a file 
    doesn't exist, return the "index.html" to allow client-side routing.
    """
    if path != "" and os.path.exists(os.path.join(current_app.static_folder, path)):
        return send_from_directory(current_app.static_folder, path)
    else:
        return send_from_directory(current_app.static_folder, "index.html")
