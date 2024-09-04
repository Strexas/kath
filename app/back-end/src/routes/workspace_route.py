"""
This module defines routes for managing workspace files and directories in a Flask application.

Endpoints:
- `/workspace`: Retrieves the structure of the workspace directory, including files and folders.
- `/workspace/<path:relative_path>`: Retrieves or updates a specific file in the workspace
    directory.

Dependencies:
- os: For file and directory operations, such as checking existence and copying directories.
- shutil: For copying directory trees, ensuring that user-specific directories are properly
    initialized.
- csv: For handling CSV file reading and writing.
- flask.Blueprint: To create and organize route blueprints for modular route management in Flask.
- flask.request: To handle incoming HTTP requests and extract headers and parameters.
- flask.jsonify: To create JSON responses for API endpoints.

Extensions:
- src.setup.extensions.compress: Used for compressing responses to optimize data transfer.
- src.setup.extensions.logger: Provides logging functionalities for capturing and recording events
    and errors.
- src.setup.constants: Contains constants for directory paths and routes used in the workspace
    management.
- src.utils.helpers: Provides utility functions for socket communication and workspace structure
    building.
- src.utils.exceptions: Defines custom exceptions used for error handling.

Endpoints:

1. `/workspace` (GET):
   - **Description**: Retrieves the structure of the user's workspace directory. If the directory
    does not exist, initializes it by copying a template directory.
   - **Headers**: Requires `uuid` and `sid` headers to identify the user session.
   - **Returns**:
     - `200 OK`: JSON representation of the workspace directory structure.
     - `400 Bad Request`: If `uuid` or `sid` headers are missing.
     - `403 Forbidden`: If there is a permission issue accessing the workspace.
     - `404 Not Found`: If the workspace directory or files are not found.
     - `500 Internal Server Error`: For unexpected errors.

2. `/workspace/<path:relative_path>` (GET):
   - **Description**: Retrieves a specific file from the user's workspace directory. Supports
    pagination for large files.
   - **Headers**: Requires `uuid` and `sid` headers.
   - **Query Parameters**: 
     - `page` (int): Page number of data to retrieve (default is 0).
     - `rowsPerPage` (int): Number of rows per page (default is 100).
   - **Returns**:
     - `200 OK`: JSON response containing paginated file data.
     - `400 Bad Request`: If `uuid` or `sid` headers are missing.
     - `403 Forbidden`: If there is a permission issue accessing the file.
     - `404 Not Found`: If the requested file does not exist.
     - `500 Internal Server Error`: For unexpected errors.

3. `/workspace/<path:relative_path>` (PUT):
   - **Description**: Saves or updates a file in the user's workspace directory. Supports CSV files
    and updates rows in the specified range.
   - **Headers**: Requires `uuid` and `sid` headers.
   - **Request Body**:
     - `page` (int): Current page number of data to be saved.
     - `rowsPerPage` (int): Number of rows per page.
     - `header` (list): Header row for the CSV file.
     - `rows` (list): Rows of data to be saved.
   - **Returns**:
     - `200 OK`: Success message indicating the file was saved successfully.
     - `400 Bad Request`: If `uuid` or `sid` headers are missing.
     - `403 Forbidden`: If there is a permission issue while saving the file.
     - `404 Not Found`: If the requested file does not exist.
     - `500 Internal Server Error`: For unexpected errors.

Errors and Feedback:
- Feedback is sent to the user's console via WebSocket events about the status of workspace and file
    operations.
- Errors include detailed logging and console feedback for issues such as missing files, permission
    errors, and unexpected exceptions.
"""

# pylint: disable=import-error
# pylint: disable=too-many-locals
# pylint: disable=too-many-lines

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
    WORKSPACE_FILE_ROUTE,
    WORKSPACE_CREATE_ROUTE,
    WORKSPACE_RENAME_ROUTE,
    WORKSPACE_DELETE_ROUTE,
    WORKSPACE_UPDATE_FEEDBACK_EVENT,
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


@workspace_route_bp.route(f"{WORKSPACE_FILE_ROUTE}/<path:relative_path>", methods=["GET"])
@compress.compressed()
def get_workspace_file(relative_path):
    """
    Retrieve a specific file from the workspace directory.

    This endpoint retrieves a file from the user's workspace directory based on the provided
    `relative_path`. If the user's workspace directory does not exist, it initializes the workspace
    by copying a template directory. The function supports pagination for large files, returning
    a specified range of rows from a CSV file. Feedback about the file retrieval process is sent to
    the user's console via WebSocket events.

    Args:
        relative_path (str): The path to the file within the user's workspace directory.

    Headers:
        uuid (str): The unique identifier for the user.
        sid (str): The session identifier for the user.

    Query Parameters:
        page (int): The page number of data to retrieve (default is 0).
        rowsPerPage (int): The number of rows per page (default is 100).

    Returns:
        Response: A JSON response containing the paginated file data or an error message. The
        response includes:
            - `200 OK` with the file data if successful.
            - `400 Bad Request` if required headers are missing.
            - `403 Forbidden` if there is a permission error.
            - `404 Not Found` if the requested file does not exist.
            - `500 Internal Server Error` for unexpected errors.

    Emits:
        CONSOLE_FEEDBACK_EVENT (str): Emits feedback messages to the user's console.

    Errors and Feedback:
        - Missing `uuid` or `sid` headers result in a `400 Bad Request` response.
        - Successful file retrieval emits a success message to the user's console.
        - File not found or permission errors emit corresponding error messages to the user's
            console and return appropriate HTTP error responses.
        - Unexpected errors are logged, reported to the user's console, and result in a `500
            Internal Server Error` response.
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
    header = ""

    total_rows = 0
    paginated_rows = []
    start_row = page * rows_per_page
    end_row = start_row + rows_per_page

    try:
        # Ensure the user specific directory exists
        if not os.path.exists(user_workspace_dir):
            # Copy the template from the template directory to the user's workspace
            shutil.copytree(WORKSPACE_TEMPLATE_DIR, user_workspace_dir)

        # Check if file is empty
        if os.path.getsize(file_path) != 0:

            # Costly operation to read the file and return the required rows.
            # It gets more expensive as the page number increases, needs to go deeper into the file.
            # Currently supports CSV files only.

            # Read the file and retrieve the rows
            with open(file_path, "r", encoding="utf-8") as file:
                reader = csv.reader(file)
                # First line as header
                header = next(reader)

                if header:
                    # Read the rows within the specified range, otherwise skip to the next row.
                    # Loop ends when the end row is reached or the end of the file is reached.
                    for i, row in enumerate(reader):
                        if start_row <= i < end_row:
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


@workspace_route_bp.route(f"{WORKSPACE_FILE_ROUTE}/<path:relative_path>", methods=["PUT"])
@compress.compressed()
def put_workspace_file(relative_path):
    """
    Handles a PUT request to save or update a workspace file for a specific user.

    This function processes a request to save or update a file in the user's workspace directory.
    It validates the presence of required headers (UUID and SID), processes the provided data, and
    writes the updated content to the specified file. The function also handles potential errors
    and sends feedback to the user's console and button via WebSocket events.

    Args:
        relative_path (str): The relative path of the file within the user's workspace directory.

    Headers:
    - uuid (str): The unique identifier for the user.
    - sid (str): The session identifier for the user.

    Request Body:
    - page (int): The current page number of the data to be saved.
    - rowsPerPage (int): The number of rows per page.
    - header (list): The header row for the CSV file.
    - rows (list): The rows of data to be saved, corresponding to the current page.

    Emits:
    - CONSOLE_FEEDBACK_EVENT (str): Emits feedback messages to the user's console.
    - WORKSPACE_FILE_SAVE_FEEDBACK_EVENT (str): Emits a status message indicating the success or
        failure of the file save operation.

    Returns:
        Response: A JSON response indicating the success or failure of the operation.

    Status Codes:
        200: Success - File saved successfully.
        400: Bad Request - UUID or SID header is missing.
        403: Forbidden - Permission error while saving the file.
        404: Not Found - Requested file not found.
        500: Internal Server Error - An unexpected error occurred.
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
    total_rows = 0

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
                if i <= end_row:
                    total_rows += 1

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

        # Build the response data
        response_data = {
            "page": page,
            "totalRows": total_rows,
            "header": header,
            "rows": rows,
        }

        return jsonify(response_data)

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


@workspace_route_bp.route(f"{WORKSPACE_CREATE_ROUTE}/<path:relative_path>", methods=["PUT"])
@workspace_route_bp.route(f"{WORKSPACE_CREATE_ROUTE}/", methods=["PUT"])
@compress.compressed()
def put_workspace_create(relative_path=None):
    """
    Creates a new file or directory in the user's workspace.

    This endpoint handles:
    - PUT `/workspace/create/<path:relative_path>`: Create at a specified `relative_path`.
    - PUT `/workspace/create/`: Create at the root of the workspace.

    Parameters:
    - `relative_path` (str, optional): Path in the workspace where the entity is created.
    - Request Headers:
      - `uuid` (str): User identifier (required).
      - `sid` (str): User session identifier (required).
    - Request Body (JSON):
      - `label` (str): Name of the new file or directory.
      - `type` (str): Type, either "file" or "folder".

    Responses:
    - **200 OK**: JSON with `newId`, `newLabel`, and `newType`.
    - **400 Bad Request**: Missing `uuid` or `sid` headers.
    - **403 Forbidden**: Permission issues.
    - **404 Not Found**: Path or file not found.
    - **500 Internal Server Error**: Unexpected errors.

    Emits:
    - Console and workspace update feedback via WebSocket.

    Example Request:
    ```
    PUT /workspace/create/myfolder
    Headers:
      uuid: <user_uuid>
      sid: <user_session_id>
    Body:
    {
      "label": "newfile.txt",
      "type": "file"
    }
    ```

    Example Response:
    ```json
    {
      "newId": "myfolder/newfile.txt",
      "newLabel": "newfile.txt",
      "newType": "file"
    }
    ```
    """

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Ensure the uuid header is present
    if not uuid:
        return jsonify({"error": "UUID header is missing"}), 400

    # Ensure the sid header is present
    if not sid:
        return jsonify({"error": "SID header is missing"}), 400

    data = request.json
    label = data.get("label")
    file_type = data.get("type")

    if relative_path is None:
        relative_path = ""

    # Emit a feedback to the user's console
    socketio_emit_to_user_session(
        CONSOLE_FEEDBACK_EVENT,
        {"type": "info", "message": f"Creating {file_type} at '{relative_path}'..."},
        uuid,
        sid,
    )

    user_workspace_dir = os.path.join(WORKSPACE_DIR, uuid)
    folder_path = os.path.join(user_workspace_dir, relative_path)
    destination_path = os.path.join(folder_path, label)

    try:
        # Ensure the user specific directory exists
        if not os.path.exists(user_workspace_dir):
            # Copy the template from the template directory to the user's workspace
            shutil.copytree(WORKSPACE_TEMPLATE_DIR, user_workspace_dir)

        # Ensure the directory exists
        os.makedirs(os.path.dirname(folder_path), exist_ok=True)

        if file_type == "file":
            open(destination_path, "w", encoding="utf-8").close()
        elif file_type == "folder":
            os.mkdir(destination_path)

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {"type": "succ", "message": f"Successfully created '{relative_path}/{label}'."},
            uuid,
            sid,
        )

        # Emit a feedback to the user's workspace
        socketio_emit_to_user_session(
            WORKSPACE_UPDATE_FEEDBACK_EVENT,
            {"status": "updated"},
            uuid,
            sid,
        )

        # Build the response data
        response_data = {
            "newId": f"{relative_path}/{label}" if relative_path else label,
            "newLabel": label,
            "newType": file_type,
        }

        return jsonify(response_data)

    except FileNotFoundError as e:
        logger.error("FileNotFoundError: %s while creating %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while creating {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while creating %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while creating {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error("UnexpectedError: %s while creating %s", e.message, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while creating {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500


@workspace_route_bp.route(f"{WORKSPACE_RENAME_ROUTE}/<path:relative_path>", methods=["PUT"])
@compress.compressed()
def put_workspace_rename(relative_path):
    """
    Renames a file or directory in the user's workspace.

    - PUT `/workspace/rename/<path:relative_path>`: Rename the item at `relative_path`.

    Parameters:
    - `relative_path` (str): Path of the item to be renamed.
    - Request Headers:
      - `uuid` (str): User identifier (required).
      - `sid` (str): User session identifier (required).
    - Request Body (JSON):
      - `label` (str): New name for the item.
      - `type` (str): Type, either "file" or "folder".

    Responses:
    - **200 OK**: JSON with `newId`, `newLabel`, and `newType`.
    - **400 Bad Request**: Missing `uuid` or `sid` headers.
    - **403 Forbidden**: Permission issues.
    - **404 Not Found**: Item not found.
    - **500 Internal Server Error**: Unexpected errors.

    Emits:
    - Console and workspace update feedback via WebSocket.

    Example Request:
    ```
    PUT /workspace/rename/myfolder
    Headers:
      uuid: <user_uuid>
      sid: <user_session_id>
    Body:
    {
      "label": "newname",
      "type": "folder"
    }
    ```

    Example Response:
    ```json
    {
      "newId": "myfolder/newname",
      "newLabel": "newname",
      "newType": "folder"
    }
    ```
    """

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Ensure the uuid header is present
    if not uuid:
        return jsonify({"error": "UUID header is missing"}), 400

    # Ensure the sid header is present
    if not sid:
        return jsonify({"error": "SID header is missing"}), 400

    data = request.json
    label = data.get("label")
    file_type = data.get("type")

    # Emit a feedback to the user's console
    socketio_emit_to_user_session(
        CONSOLE_FEEDBACK_EVENT,
        {"type": "info", "message": f"Renaming {file_type} at '{relative_path}'..."},
        uuid,
        sid,
    )

    user_workspace_dir = os.path.join(WORKSPACE_DIR, uuid)
    destination_path = os.path.join(user_workspace_dir, relative_path)
    new_path = os.path.join(os.path.dirname(destination_path), label)

    try:
        # Ensure the user specific directory exists
        if not os.path.exists(user_workspace_dir):
            # Copy the template from the template directory to the user's workspace
            shutil.copytree(WORKSPACE_TEMPLATE_DIR, user_workspace_dir)

        # Ensure the directory exists
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)

        # Rename the file or folder
        os.rename(destination_path, new_path)

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {"type": "succ", "message": f"Successfully renamed '{relative_path}'."},
            uuid,
            sid,
        )

        # Emit a feedback to the user's workspace
        socketio_emit_to_user_session(
            WORKSPACE_UPDATE_FEEDBACK_EVENT,
            {"status": "updated"},
            uuid,
            sid,
        )

        # Build the response data
        response_data = {
            "newId": (
                f"{os.path.dirname(relative_path)}/{label}"
                if os.path.dirname(relative_path)
                else label
            ),
            "newLabel": label,
            "newType": file_type,
        }

        return jsonify(response_data)

    except FileNotFoundError as e:
        logger.error("FileNotFoundError: %s while renaming %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while renaming {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while renaming %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while renaming {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error("UnexpectedError: %s while renaming %s", e.message, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while renaming {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500


@workspace_route_bp.route(f"{WORKSPACE_DELETE_ROUTE}/<path:relative_path>", methods=["PUT"])
@compress.compressed()
def put_workspace_delete(relative_path):
    """
    Deletes a file or directory from the user's workspace.

    - PUT `/workspace/delete/<path:relative_path>`: Deletes the item at `relative_path`.

    Parameters:
    - `relative_path` (str): Path of the item to be deleted.
    - Request Headers:
      - `uuid` (str): User identifier (required).
      - `sid` (str): User session identifier (required).
    - Request Body (JSON):
      - `type` (str): Type of the item to delete, either "file" or "folder".

    Responses:
    - **200 OK**: JSON with `oldId` of the deleted item.
    - **400 Bad Request**: Missing `uuid` or `sid` headers.
    - **403 Forbidden**: Permission issues.
    - **404 Not Found**: Item not found.
    - **500 Internal Server Error**: Unexpected errors.

    Emits:
    - Console and workspace update feedback via WebSocket.

    Example Request:
    ```
    PUT /workspace/delete/myfolder
    Headers:
      uuid: <user_uuid>
      sid: <user_session_id>
    Body:
    {
      "type": "folder"
    }
    ```

    Example Response:
    ```json
    {
      "oldId": "myfolder"
    }
    ```
    """

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Ensure the uuid header is present
    if not uuid:
        return jsonify({"error": "UUID header is missing"}), 400

    # Ensure the sid header is present
    if not sid:
        return jsonify({"error": "SID header is missing"}), 400

    data = request.json
    file_type = data.get("type")

    # Emit a feedback to the user's console
    socketio_emit_to_user_session(
        CONSOLE_FEEDBACK_EVENT,
        {"type": "info", "message": f"Deleting {file_type} at '{relative_path}'..."},
        uuid,
        sid,
    )

    user_workspace_dir = os.path.join(WORKSPACE_DIR, uuid)
    destination_path = os.path.join(user_workspace_dir, relative_path)

    try:
        # Ensure the user specific directory exists
        if not os.path.exists(user_workspace_dir):
            # Copy the template from the template directory to the user's workspace
            shutil.copytree(WORKSPACE_TEMPLATE_DIR, user_workspace_dir)

        # Ensure the directory exists
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)

        # Delete the file or folder
        if file_type == "file":
            os.remove(destination_path)
        elif file_type == "folder":
            shutil.rmtree(destination_path)

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {"type": "succ", "message": f"Successfully deleted '{relative_path}'."},
            uuid,
            sid,
        )

        # Emit a feedback to the user's workspace
        socketio_emit_to_user_session(
            WORKSPACE_UPDATE_FEEDBACK_EVENT,
            {"status": "updated"},
            uuid,
            sid,
        )

        # Build the response data
        response_data = {
            "oldId": relative_path,
        }

        return jsonify(response_data)

    except FileNotFoundError as e:
        logger.error("FileNotFoundError: %s while deleting %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while deleting {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while deleting %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while deleting {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error("UnexpectedError: %s while deleting %s", e.message, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while deleting {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500
