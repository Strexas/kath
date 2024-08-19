"""
This module defines routes for managing workspace files and directories.

It provides endpoints for:
- Retrieving a specific file from the workspace directory.
- Retrieving the structure of the workspace directory.

Dependencies:
- os: For file and directory operations.
- shutil: For copying directory trees.
- flask.Blueprint: To create route blueprints for the Flask application.
- flask.request: To handle incoming HTTP requests.
- flask.jsonify: To create JSON responses.
- flask.send_file: To serve files for download.

Extensions:
- src.setup.extensions.compress: For compressing responses.
- src.setup.extensions.logger: For logging errors and events.
- src.setup.constants: Contains constants for directory paths and routes.
"""

import os
import shutil
from flask import Blueprint, request, jsonify, send_file

from src.setup.extensions import compress, logger
from src.setup.constants import WORKSPACE_DIR, WORKSPACE_TEMPLATE_DIR, WORKSPACE_ROUTE

workspace_route_bp = Blueprint("workspace_route", __name__)


@workspace_route_bp.route(f"{WORKSPACE_ROUTE}/<path:relative_path>", methods=["GET"])
@compress.compressed()
def get_workspace_file(relative_path):
    """
    Retrieve a specific file from the workspace directory.

    This endpoint serves files from the user's workspace directory. If the directory does not exist,
    it copies a template directory to the user's workspace. The file specified by `relative_path`
    is then served for download.

    Args:
        relative_path (str): The path to the file within the user's workspace directory.

    Returns:
        Response: A Flask response object containing the file or an error message.
    """
    uuid = request.headers.get("uuid")

    # Ensure the uuid header is present
    if not uuid:
        return jsonify({"error": "UUID header is missing"}), 400

    user_workspace_dir = os.path.join(WORKSPACE_DIR, uuid)
    file_path = os.path.join(user_workspace_dir, relative_path)

    try:
        # Ensure the user specific directory exists
        if not os.path.exists(user_workspace_dir):
            # Copy the template from the template directory to the user's workspace
            shutil.copytree(WORKSPACE_TEMPLATE_DIR, user_workspace_dir)

        # Serve the file
        return send_file(file_path, as_attachment=False)

    except FileNotFoundError as e:
        logger.error(f"FileNotFoundError: {e} while accessing {file_path}")
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error(f"PermissionError: {e} while accessing {file_path}")
        return jsonify({"error": "Permission denied"}), 403
    except Exception as e:
        logger.error(
            f"Unexpected error while serving file '{relative_path}' for UUID '{uuid}': {e}"
        )
        return jsonify({"error": "An internal error occurred"}), 500


@workspace_route_bp.route(f"{WORKSPACE_ROUTE}", methods=["GET"])
def get_workspace():
    """
    Retrieve the structure of the workspace directory.

    This endpoint provides a JSON representation of the user's workspace directory structure. If the directory
    does not exist, it copies a template directory to the user's workspace. The structure includes file and
    folder information.

    Returns:
        Response: A Flask response object containing the workspace structure or an error message.
    """
    uuid = request.headers.get("uuid")

    # Ensure the uuid header is present
    if not uuid:
        return jsonify({"error": "UUID header is missing"}), 400

    user_workspace_dir = os.path.join(WORKSPACE_DIR, uuid)

    try:
        # Ensure the user specific directory exists
        if not os.path.exists(user_workspace_dir):
            # Copy the template from the template directory to the user's workspace
            shutil.copytree(WORKSPACE_TEMPLATE_DIR, user_workspace_dir)

        def build_workspace_structure(path):
            """
            Recursively build the directory structure for the workspace.

            Args:
                path (str): The current directory path.

            Returns:
                dict: A dictionary representing the directory structure.
            """
            workspace_structure = {
                "id": os.path.relpath(path, user_workspace_dir),
                "label": os.path.basename(path),
                "fileType": "folder" if os.path.isdir(path) else "csv",
                "children": [],
            }

            if os.path.isdir(path):
                workspace_structure["children"] = [
                    build_workspace_structure(os.path.join(path, child))
                    for child in os.listdir(path)
                ]

            return workspace_structure

        # Build and return the workspace structure as a JSON object
        workspace_structure = [
            build_workspace_structure(os.path.join(user_workspace_dir, child))
            for child in os.listdir(user_workspace_dir)
        ]
        return jsonify(workspace_structure)

    except FileNotFoundError as e:
        logger.error(f"FileNotFoundError: {e} while accessing {user_workspace_dir}")
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error(f"PermissionError: {e} while accessing {user_workspace_dir}")
        return jsonify({"error": "Permission denied"}), 403
    except Exception as e:
        logger.error(f"Unexpected error while serving workspace for UUID '{uuid}': {e}")
        return jsonify({"error": "An internal error occurred"}), 500
