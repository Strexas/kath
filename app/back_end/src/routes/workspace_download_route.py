"""
Workspace download route module.
This module defines routes for downloading data from external sources
and saving it to the user's workspace.
"""

# pylint: disable=import-error

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
from app.back_end.data.downloading import download_selected_database_for_eys_gene

workspace_download_route_bp = Blueprint("workspace_download_route", __name__)


@workspace_download_route_bp.route(
    f"{WORKSPACE_DOWNLOAD_ROUTE}/lovd/<path:relative_path>", methods=["GET"]
)
def get_workspace_download_lovd(relative_path):
    """
    Download LOVD data for a specific gene and save it to the user's workspace.
    """

    # Check if 'uuid' and 'sid' are provided in the headers
    if "uuid" not in request.headers or "sid" not in request.headers:
        return jsonify({"error": "UUID and SID headers are required"}), 400

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Check if 'override' and 'gene' are provided
    if "override" not in request.args or "gene" not in request.args:
        return jsonify({"error": "'override' and 'gene' parameters are required"}), 400

    # Explanation about the parameters:
    # - destination_path: string
    #     - The path to the destination file (where to save it) in the user's workspace
    #       Destination file can either be a new file or an existing file, check its existence
    # - override: boolean
    #     - If true, the existing destination file should be overridden
    #     - If false, the existing destination file should not be overridden and download
    #       content should be appended
    # - gene: string
    #     - Determines the gene to be downloaded from LOVD (e.g. 'eys')

    destination_path = os.path.join(WORKSPACE_DIR, uuid, relative_path)
    override = request.args.get("override")
    gene = request.args.get("gene")

    try:
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "info",
                "message": f"Downloading LOVD data for gene '{gene}' to '{relative_path}' with "
                + f"override: '{override}'...",
            },
            uuid,
            sid,
        )
        download_selected_database_for_eys_gene(save_path=destination_path, override=override, database_name='lovd')

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {"type": "succ", "message": f"LOVD file '{relative_path}' was saved successfully."},
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
        logger.error("FileNotFoundError: %s while downloading LOVD %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while downloading LOVD {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while downloading LOVD %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while downloading LOVD {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error("UnexpectedError: %s while downloading LOVD %s", e.message, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while downloading LOVD "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500

    return jsonify({"message": "LOVD data downloaded successfully"}), 200


@workspace_download_route_bp.route(
    f"{WORKSPACE_DOWNLOAD_ROUTE}/clinvar/<path:relative_path>", methods=["GET"]
)
def get_workspace_download_clinvar(relative_path):
    """
    Download ClinVar data for a specific gene and save it to the user's workspace.
    """

    # Check if 'uuid' and 'sid' are provided in the headers
    if "uuid" not in request.headers or "sid" not in request.headers:
        return jsonify({"error": "UUID and SID headers are required"}), 400

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Check if 'override' and 'gene' are provided
    if "override" not in request.args or "gene" not in request.args:
        return jsonify({"error": "'override' and 'gene' parameters are required"}), 400

    # Explanation about the parameters:
    # - destination_path: string
    #     - The path to the destination file (where to save it) in the user's workspace
    #       Destination file can either be a new file or an existing file, check its existence
    # - override: boolean
    #     - If true, the existing destination file should be overridden
    #     - If false, the existing destination file should not be overridden and download
    #       content should be appended
    # - gene: string
    #     - Determines the gene to be downloaded from LOVD (e.g. 'eys')

    destination_path = os.path.join(WORKSPACE_DIR, uuid, relative_path)
    override = request.args.get("override")
    gene = request.args.get(
        "gene",
    )

    try:
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "info",
                "message": f"Downloading ClinVar data for gene '{gene}' to '{relative_path}' with "
                + f"override: '{override}'...",
            },
            uuid,
            sid,
        )

        #
        # TODO: Implement ClinVar data download and save logic using defined parameters
        # [destination_path, override, gene]
        #

        # TODO: Remove this sleep statement once the download logic is implemented
        time.sleep(1)  # Simulate a delay for the download process

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {"type": "succ", "message": f"ClinVar file '{relative_path}' was saved successfully."},
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
        logger.error("FileNotFoundError: %s while downloading ClinVar %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while downloading ClinVar {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while downloading ClinVar %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while downloading ClinVar {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error(
            "UnexpectedError: %s while downloading ClinVar %s", e.message, destination_path
        )
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while downloading ClinVar "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500

    return jsonify({"message": "CliVar data downloaded successfullly"}), 200


@workspace_download_route_bp.route(
    f"{WORKSPACE_DOWNLOAD_ROUTE}/gnomad/<path:relative_path>", methods=["GET"]
)
def get_workspace_download_gnomad(relative_path):
    """
    Download gnomAD data for a specific gene and save it to the user's workspace.
    """

    # Check if 'uuid' and 'sid' are provided in the headers
    if "uuid" not in request.headers or "sid" not in request.headers:
        return jsonify({"error": "UUID and SID headers are required"}), 400

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Check if 'override' and 'gene' are provided
    if "override" not in request.args or "gene" not in request.args:
        return jsonify({"error": "'override' and 'gene' parameters are required"}), 400

    # Explanation about the parameters:
    # - destination_path: string
    #     - The path to the destination file (where to save it) in the user's workspace
    #       Destination file can either be a new file or an existing file, check its existence
    # - override: boolean
    #     - If true, the existing destination file should be overridden
    #     - If false, the existing destination file should not be overridden and download
    #       content should be appended
    # - gene: string
    #     - Determines the gene to be downloaded from LOVD (e.g. 'eys')

    destination_path = os.path.join(WORKSPACE_DIR, uuid, relative_path)
    override = request.args.get("override")
    gene = request.args.get("gene")

    try:
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "info",
                "message": f"Downloading gnomAD data for gene '{gene}' to '{relative_path}' with "
                + f"override: '{override}'...",
            },
            uuid,
            sid,
        )

        download_selected_database_for_eys_gene(save_path=destination_path, override=override, database_name='gnomad')

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {"type": "succ", "message": f"gnomAD file '{relative_path}' was saved successfully."},
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
        logger.error("FileNotFoundError: %s while downloading gnomAD %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while downloading gnomAD {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while downloading gnomAD %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while downloading gnomAD {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error("UnexpectedError: %s while downloading gnomAD %s", e.message, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while downloading gnomAD "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500

    return jsonify({"message": "gnomAD data downloaded successfullly"}), 200
