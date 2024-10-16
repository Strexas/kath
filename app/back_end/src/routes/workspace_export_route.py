"""
Handle file export from the workspace.

This module provides a Flask route for exporting files from a user's workspace.
It performs the following:
- Retrieves the file based on the user's workspace and the requested path.
- Emits feedback to the user's console via SocketIO during the export process.
- Handles exceptions like file not found, permission errors, or unexpected errors,
  returning appropriate HTTP responses.

Routes:
    GET /workspace_export/<path:relative_path>: Exports the requested file.
"""


import os
from flask import Blueprint, request, jsonify, send_file

from ..setup.extensions import compress, logger
from ..utils.helpers import socketio_emit_to_user_session
from ..utils.exceptions import UnexpectedError
from ..constants import (
    WORKSPACE_DIR,
    CONSOLE_FEEDBACK_EVENT,
    WORKSPACE_EXPORT_ROUTE,
)

workspace_export_route_bp = Blueprint("workspace_export_route", __name__)


@workspace_export_route_bp.route(f"{WORKSPACE_EXPORT_ROUTE}/<path:relative_path>", methods=["GET"])
@compress.compressed()
def get_workspace_export(relative_path):
    """
    Export a file from the user's workspace.

    Handles file export requests by retrieving the file from the user's workspace and
    sending it as a downloadable attachment. Emits real-time feedback during the process.

    Args:
        relative_path (str): The path to the file to be exported within the user's workspace.

    Headers:
        uuid: Unique identifier for the user's workspace.
        sid: Session identifier for emitting real-time events.

    Returns:
        A downloadable file or a JSON response with an error message.
    """

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Ensure the uuid header is present
    if not uuid:
        return jsonify({"error": "UUID header is missing"}), 400

    # Ensure the sid header is present
    if not sid:
        return jsonify({"error": "SID header is missing"}), 400

    try:
        user_workspace_dir = os.path.join(WORKSPACE_DIR, uuid)
        file_path = os.path.join(user_workspace_dir, relative_path)

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {"type": "info", "message": f"Exporting file '{relative_path}'..."},
            uuid,
            sid,
        )

        response = send_file(file_path, as_attachment=True)

        return response

    except FileNotFoundError as e:
        logger.error("FileNotFoundError: %s while exporting %s", e, user_workspace_dir)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while exporting {user_workspace_dir}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while exporting %s", e, user_workspace_dir)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while exporting {user_workspace_dir}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error("UnexpectedError: %s while exporting %s", e.message, user_workspace_dir)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while exporting {user_workspace_dir}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500
