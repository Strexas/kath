"""
Workspace download route module.
This module defines routes for downloading data from external sources
and saving it to the user's workspace.
"""

# pylint: disable=import-error
# pylint: disable=broad-exception-caught

import os
import time  # TODO: Remove this import once the download logic is implemented
from flask import Blueprint, request, jsonify

from ..setup.extensions import logger
from ..utils.helpers import socketio_emit_to_user_session
from ..utils.exceptions import UnexpectedError
from ..constants import (
    WORKSPACE_DOWNLOAD_ROUTE,
    WORKSPACE_DIR,
    CONSOLE_FEEDBACK_EVENT,
    WORKSPACE_UPDATE_FEEDBACK_EVENT,
)

from ..data.downloading import download_selected_database_for_eys_gene

workspace_download_route_bp = Blueprint("workspace_download_route", __name__)


@workspace_download_route_bp.route(
    f"{WORKSPACE_DOWNLOAD_ROUTE}/<path:relative_path>", methods=["GET"]
)
def get_workspace_download(relative_path):
    """
    Download data for a specific gene from specified database and save it to the user's workspace.
    """

    # Check if 'uuid' and 'sid' are provided in the headers
    if "uuid" not in request.headers or "sid" not in request.headers:
        return jsonify({"error": "UUID and SID headers are required"}), 400

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Check if 'override', 'gene' and 'source' are provided
    if (
        "override" not in request.args
        or "gene" not in request.args
        or "source" not in request.args
    ):
        return (
            jsonify(
                {"error": "'override', 'gene' and 'source' parameters are required"}
            ),
            400,
        )

    # Explanation about the parameters:
    # - source: string
    #     - name of database from which to download data
    # - destination_path: string
    #     - The path to the destination file (where to save it) in the user's workspace
    #       Destination file can either be a new file or an existing file, check its existence
    # - override: boolean
    #     - If true, the existing destination file should be overridden
    #     - If false, the existing destination file should not be overridden and download
    #       content should be appended
    # - gene: string
    #     - Determines the gene to be downloaded from LOVD (e.g. 'eys')

    source = request.args.get("source")
    destination_path = os.path.join(WORKSPACE_DIR, uuid, relative_path)
    override = request.args.get("override")
    gene = request.args.get("gene")

    try:
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "info",
                "message": f"Downloading '{source}' database data for gene '{gene}'"
                + f" to '{relative_path}' with override: '{override}'...",
            },
            uuid,
            sid,
        )

        download_selected_database_for_eys_gene(database_name=source, save_path=destination_path, override=override)

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "succ",
                "message": f"'{source}' file '{relative_path}' was saved successfully.",
            },
            uuid,
            sid,
        )

        socketio_emit_to_user_session(
            WORKSPACE_UPDATE_FEEDBACK_EVENT,
            {"status": "updated"},
            uuid,
            sid,
        )

    except FileNotFoundError as e:
        logger.error(
            "FileNotFoundError: %s while downloading %s %s", e, source, destination_path
        )
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while downloading {source} {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error(
            "PermissionError: %s while downloading %s %s", e, source, destination_path
        )
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while downloading {source} {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error(
            "UnexpectedError: %s while downloading %s %s",
            e.message,
            source,
            destination_path,
        )
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while downloading {source} "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500
    except Exception as e:
        logger.error(
            "UnexpectedError: %s while downloading %s %s",
            e,
            source,
            destination_path,
        )
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e} while downloading {source} "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500

    return jsonify({"message": f"{source} data downloaded successfully"}), 200
