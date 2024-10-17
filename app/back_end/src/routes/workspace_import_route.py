"""
Handle file import into the workspace.

This module provides a Flask route for importing files into a user's workspace.
It performs the following:
- Accepts files of type 'csv' or 'txt' for upload.
- Saves the file to the specified workspace directory.
- Emits feedback to the user's console via SocketIO during the import process.
- Handles exceptions like file not found, permission errors, or unexpected errors,
  returning appropriate HTTP responses.

Routes:
    POST /workspace_import: Imports a file to the root folder.
    POST /workspace_import/<path:relative_path>: Imports a file to the specified folder.
"""


import os
from flask import Blueprint, request, jsonify

from ..setup.extensions import compress, logger
from ..utils.helpers import socketio_emit_to_user_session
from ..utils.exceptions import UnexpectedError
from ..constants import (
    WORKSPACE_DIR,
    WORKSPACE_UPDATE_FEEDBACK_EVENT,
    CONSOLE_FEEDBACK_EVENT,
    WORKSPACE_IMPORT_ROUTE,
)

workspace_import_route_bp = Blueprint("workspace_import_route", __name__)


@workspace_import_route_bp.route(f"{WORKSPACE_IMPORT_ROUTE}", methods=["POST"])
@workspace_import_route_bp.route(f"{WORKSPACE_IMPORT_ROUTE}/<path:relative_path>", methods=["POST"])
@compress.compressed()
def post_workspace_import(relative_path=None):
    """
    Import a file into the user's workspace.

    Handles file uploads to the workspace, ensuring the file is of type 'csv' or 'txt'.
    Saves the file to the appropriate folder and sends real-time feedback to the user's console.

    Args:
        relative_path (str, optional): The folder within the workspace where the file should
        be saved.

    Headers:
        uuid: Unique identifier for the user's workspace.
        sid: Session identifier for emitting real-time events.

    Request:
        A file part must be included in the request.

    Returns:
        JSON response with a success or error message.
    """

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Ensure the uuid header is present
    if not uuid:
        return jsonify({"error": "UUID header is missing"}), 400

    # Ensure the sid header is present
    if not sid:
        return jsonify({"error": "SID header is missing"}), 400

    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected for importing"}), 400

    file_extension = file.filename.rsplit(".", 1)[1].lower() if "." in file.filename else None
    if file_extension not in ["csv", "txt"]:
        return (
            jsonify(
                {
                    "error": f"FileImportError: Incorrect file type for '{file.filename}'. "
                    + "Accepted file types: 'csv', 'txt'."
                }
            ),
            400,
        )

    relative_path_title = relative_path

    if relative_path is None:
        relative_path = ""
        relative_path_title = "root folder"

    socketio_emit_to_user_session(
        CONSOLE_FEEDBACK_EVENT,
        {
            "type": "info",
            "message": f"Importing file '{file.filename}' to '{relative_path_title}'...",
        },
        uuid,
        sid,
    )

    try:
        user_workspace_dir = os.path.join(WORKSPACE_DIR, uuid)
        folder_path = os.path.join(user_workspace_dir, relative_path)
        destination_path = os.path.join(folder_path, file.filename)
        file.save(destination_path)

        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {"type": "succ", "message": f"File {file.filename} was imported successfully."},
            uuid,
            sid,
        )

        socketio_emit_to_user_session(
            WORKSPACE_UPDATE_FEEDBACK_EVENT,
            {"status": "updated"},
            uuid,
            sid,
        )

        return jsonify({"message": "File imported successfully"}), 200

    except FileNotFoundError as e:
        logger.error("FileNotFoundError: %s while importing %s", e, user_workspace_dir)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while importing {user_workspace_dir}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while importing %s", e, user_workspace_dir)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while importing {user_workspace_dir}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error("UnexpectedError: %s while importing %s", e.message, user_workspace_dir)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while importing {user_workspace_dir}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500
