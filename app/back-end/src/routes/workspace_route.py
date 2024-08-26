"""
This module defines routes for managing workspace files and directories in a Flask application.

Endpoints include:
- `/workspace`: Retrieves the structure of the workspace directory, including files and folders.
- `/workspace/<path:relative_path>`: Retrieves a specific file from the workspace directory.

Dependencies:
- os: For file and directory operations, such as checking existence and copying directories.
- shutil: For copying directory trees, ensuring that user-specific directories are properly
    initialized.
- flask.Blueprint: To create and organize route blueprints for modular route management in Flask.
- flask.request: To handle incoming HTTP requests and extract headers and parameters.
- flask.jsonify: To create JSON responses for API endpoints.
- flask.send_file: To serve files for download.

Extensions:
- src.setup.extensions.compress: Used for compressing responses to optimize data transfer.
- src.setup.extensions.logger: Provides logging functionalities for capturing and recording events
    and errors.
- src.setup.constants: Contains constants for directory paths and routes used in the workspace
    management.
"""

# pylint: disable=import-error

import os
import shutil
import csv
from flask import Blueprint, request, jsonify

from src.setup.extensions import compress, logger
from src.utils.helpers import socketio_emit_to_user_session, build_workspace_structure
from src.utils.exceptions import UnexpectedError
from src.constants import (
    WORKSPACE_DIR,
    WORKSPACE_TEMPLATE_DIR,
    WORKSPACE_ROUTE,
    CONSOLE_FEEDBACK_EVENT,
    WORKSPACE_FILE_SAVE_FEEDBACK_EVENT,
)

workspace_route_bp = Blueprint("workspace_route", __name__)


@workspace_route_bp.route(WORKSPACE_ROUTE, methods=["GET"])
def get_workspace():
    """
    Retrieve the structure of the workspace directory.

    This endpoint provides a JSON representation of the user's workspace directory structure. If the
    directory does not exist, it copies a template directory to the user's workspace. The structure
    includes metadata about files and folders in the workspace.

    Process:
        - Extracts the UUID and SID from request headers to identify the user session.
        - Ensures that the user-specific workspace directory exists; if not, copies a template
            directory.
        - Builds the directory structure as a nested JSON object.
        - Emits feedback to the user's console about the status of the workspace retrieval process.

    Args:
        None: This endpoint does not require additional query parameters.

    Returns:
        Response: A Flask response object with the following possible outcomes:
            - `200 OK`: If the workspace structure is successfully retrieved, returns a JSON
                representation of the directory structure.
            - `400 Bad Request`: If the UUID or SID header is missing in the request.
            - `403 Forbidden`: If there is a permission issue accessing the workspace directory.
            - `404 Not Found`: If the workspace directory or files are not found.
            - `500 Internal Server Error`: For unexpected errors encountered during the process.

    Errors and Feedback:
        - If the `uuid` or `sid` headers are missing, returns a `400 Bad Request` response.
        - On successful retrieval, a success message is emitted to the user's console.
        - In case of errors, appropriate feedback is emitted to the user's console and an error
            response is returned:
            - `FileNotFoundError`: Indicates that the directory or file was not found.
            - `PermissionError`: Indicates permission issues while accessing the workspace
                directory.
            - Other exceptions: Logs and reports unexpected errors.
    """

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Ensure the uuid header is present
    if not uuid:
        return jsonify({"error": "UUID header is missing"}), 400

    # Ensure the sid header is present
    if not sid:
        return jsonify({"error": "SID header is missing"}), 400

    # Emit a feedback to the user's console
    socketio_emit_to_user_session(
        CONSOLE_FEEDBACK_EVENT,
        {"type": "info", "message": "Accessing workspace..."},
        uuid,
        sid,
    )

    user_workspace_dir = os.path.join(WORKSPACE_DIR, uuid)

    try:
        # Ensure the user specific directory exists
        if not os.path.exists(user_workspace_dir):
            # Copy the template from the template directory to the user's workspace
            shutil.copytree(WORKSPACE_TEMPLATE_DIR, user_workspace_dir)

        # Build and return the workspace structure as a JSON object
        workspace_structure = [
            build_workspace_structure(os.path.join(user_workspace_dir, child), user_workspace_dir)
            for child in os.listdir(user_workspace_dir)
        ]

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {"type": "succ", "message": "Workspace structure retrieved successfully."},
            uuid,
            sid,
        )

        # Return the workspace structure
        return jsonify(workspace_structure)

    except FileNotFoundError as e:
        logger.error("FileNotFoundError: %s while accessing %s", e, user_workspace_dir)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while accessing {user_workspace_dir}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while accessing %s", e, user_workspace_dir)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while accessing {user_workspace_dir}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error("UnexpectedError: %s while accessing %s", e.message, user_workspace_dir)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while accessing {user_workspace_dir}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500


@workspace_route_bp.route(f"{WORKSPACE_ROUTE}/<path:relative_path>", methods=["GET"])
@compress.compressed()
def get_workspace_file(relative_path):
    """
    Retrieve a specific file from the workspace directory.

    This endpoint serves files from the user's workspace directory. If the directory does not exist,
    it copies a template directory to the user's workspace. The file specified by `relative_path`
    is then served for download. Feedback about the file retrieval process is sent to the user's
    console via Socket.IO.

    Args:
        relative_path (str): The path to the file within the user's workspace directory.

    Returns:
        Response: A Flask response object containing the file or an error message. The response is:
            - `200 OK` with the file if successful.
            - `400 Bad Request` if required headers are missing.
            - `403 Forbidden` if there is a permission error.
            - `404 Not Found` if the requested file does not exist.
            - `500 Internal Server Error` for unexpected errors.

    Errors and Feedback:
        - If the `uuid` or `sid` headers are missing, a `400 Bad Request` response is returned.
        - On successful file retrieval, a success message is emitted to the user's console.
        - On errors, appropriate feedback is emitted to the user's console and an error response is
            returned:
            - `FileNotFoundError`: Indicates the requested file was not found.
            - `PermissionError`: Indicates permission issues while accessing the file.
            - Other exceptions: Logs and reports unexpected errors.
    """

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Ensure the uuid header is present
    if not uuid:
        return jsonify({"error": "UUID header is missing"}), 400

    # Ensure the sid header is present
    if not sid:
        return jsonify({"error": "SID header is missing"}), 400

    # Emit a feedback to the user's console
    socketio_emit_to_user_session(
        CONSOLE_FEEDBACK_EVENT,
        {"type": "info", "message": f"Accessing file at '{relative_path}'..."},
        uuid,
        sid,
    )

    user_workspace_dir = os.path.join(WORKSPACE_DIR, uuid)
    file_path = os.path.join(user_workspace_dir, relative_path)

    page = int(request.args.get("page", 0))
    rows_per_page = int(request.args.get("rowsPerPage", 100))

    total_rows = 0
    paginated_rows = []
    start_row = page * rows_per_page
    end_row = start_row + rows_per_page

    try:
        # Ensure the user specific directory exists
        if not os.path.exists(user_workspace_dir):
            # Copy the template from the template directory to the user's workspace
            shutil.copytree(WORKSPACE_TEMPLATE_DIR, user_workspace_dir)

        # Costly operation to read the file and return the required rows.
        # It gets more expensive as the page number increases, needs to go deeper into the file.
        # Currently supports CSV files only.

        # Read the file and retrieve the rows
        with open(file_path, "r", encoding="utf-8") as file:
            reader = csv.reader(file)
            # First line as header
            header = next(reader)

            # Read the rows within the specified range, otherwise skip to the next row.
            # Loop ends when the end row is reached or the end of the file is reached.
            for i, row in enumerate(reader):
                if i >= start_row and i < end_row:
                    paginated_rows.append(row)
                total_rows += 1

                if i >= end_row:
                    break

        # Build the response data
        response_data = {
            "page": page,
            "totalRows": total_rows,
            "header": header,
            "rows": paginated_rows,
        }

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "succ",
                "message": f"File at '{relative_path}' retrieved successfully.",
            },
            uuid,
            sid,
        )

        # Serve the file in batches
        return jsonify(response_data)

    except FileNotFoundError as e:
        logger.error("FileNotFoundError: %s while accessing %s", e, file_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while accessing {file_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while accessing %s", e, file_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while accessing {file_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error("UnexpectedError: %s while accessing %s", e.message, file_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while accessing {file_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500


@workspace_route_bp.route(f"{WORKSPACE_ROUTE}/<path:relative_path>", methods=["PUT"])
@compress.compressed()
def put_workspace_file(relative_path):
    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Ensure the uuid header is present
    if not uuid:
        return jsonify({"error": "UUID header is missing"}), 400

    # Ensure the sid header is present
    if not sid:
        return jsonify({"error": "SID header is missing"}), 400

    # Emit a feedback to the user's console
    socketio_emit_to_user_session(
        CONSOLE_FEEDBACK_EVENT,
        {"type": "info", "message": f"Saving file at '{relative_path}'..."},
        uuid,
        sid,
    )

    user_workspace_dir = os.path.join(WORKSPACE_DIR, uuid)
    file_path = os.path.join(user_workspace_dir, relative_path)

    data = request.json
    page = data.get("page")
    rows_per_page = data.get("rowsPerPage")
    header = data.get("header")
    rows = data.get("rows")

    start_row = page * rows_per_page
    end_row = start_row + rows_per_page

    try:
        # Ensure the user specific directory exists
        if not os.path.exists(user_workspace_dir):
            # Copy the template from the template directory to the user's workspace
            shutil.copytree(WORKSPACE_TEMPLATE_DIR, user_workspace_dir)

        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # Costly operation to read the entire file and update the required rows.
        # One full file cycle.
        # Currently supports CSV files only.

        # Create a temporary file to write updated content
        temp_file_path = f"{file_path}.tmp"

        # Read the file and write the updated rows
        with open(file_path, "r", encoding="utf-8") as infile, open(
            temp_file_path, "w", encoding="utf-8"
        ) as outfile:
            reader = csv.reader(infile)
            writer = csv.writer(outfile)

            # Skip the header
            next(reader)
            writer.writerow(header)  # Write the new header

            for i, row in enumerate(reader):
                if start_row <= i < end_row:
                    writer.writerow(rows[i - start_row])  # Write the updated row
                else:
                    writer.writerow(row)  # Write the existing row

        # Replace the old file with the new file
        os.replace(temp_file_path, file_path)

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {"type": "succ", "message": f"File at '{relative_path}' saved successfully."},
            uuid,
            sid,
        )

        # Emit a feedback to the user's button
        socketio_emit_to_user_session(
            WORKSPACE_FILE_SAVE_FEEDBACK_EVENT,
            {"status": "success"},
            uuid,
            sid,
        )

        return jsonify({"status": "success"})

    except FileNotFoundError as e:
        logger.error("FileNotFoundError: %s while saving %s", e, file_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while saving {file_path}",
            },
            uuid,
            sid,
        )
        # Emit a feedback to the user's button
        socketio_emit_to_user_session(
            WORKSPACE_FILE_SAVE_FEEDBACK_EVENT,
            {"status": "error"},
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while saving %s", e, file_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while saving {file_path}",
            },
            uuid,
            sid,
        )
        # Emit a feedback to the user's button
        socketio_emit_to_user_session(
            WORKSPACE_FILE_SAVE_FEEDBACK_EVENT,
            {"status": "error"},
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error("UnexpectedError: %s while saving %s", e.message, file_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while saving {file_path}",
            },
            uuid,
            sid,
        )
        # Emit a feedback to the user's button
        socketio_emit_to_user_session(
            WORKSPACE_FILE_SAVE_FEEDBACK_EVENT,
            {"status": "error"},
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500
