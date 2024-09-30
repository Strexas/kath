"""
Workspace merge route module.
This module defines routes for merging data from different sources and saving the merged data to
the user's workspace.
"""

# pylint: disable=import-error

import os
import time  # TODO: Remove this import once the merge logic is implemented

import pandas as pd
from flask import Blueprint, request, jsonify

from src.setup.extensions import logger
from src.utils.helpers import socketio_emit_to_user_session
from src.utils.exceptions import UnexpectedError
from src.constants import (
    WORKSPACE_MERGE_ROUTE,
    WORKSPACE_DIR,
    CONSOLE_FEEDBACK_EVENT,
    WORKSPACE_UPDATE_FEEDBACK_EVENT,
)

from api import set_lovd_dtypes, parse_lovd
from api.data import merge_gnomad_lovd, set_gnomad_dtypes, parse_gnomad

workspace_merge_route_bp = Blueprint("workspace_merge_route", __name__)


@workspace_merge_route_bp.route(
    f"{WORKSPACE_MERGE_ROUTE}/lovd_gnomad/<path:relative_path>", methods=["GET"]
)
def get_workspace_merge_lovd_gnomad(relative_path):
    """
    Route to merge LOVD and gnomAD data and save the merged data to the workspace.
    """

    # Check if 'uuid' and 'sid' are provided in the headers
    if "uuid" not in request.headers or "sid" not in request.headers:
        return jsonify({"error": "UUID and SID headers are required"}), 400

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Check if 'override', 'lovdFile' and 'gnomadFile' are provided
    if (
        "override" not in request.args
        or "lovdFile" not in request.args
        or "gnomadFile" not in request.args
    ):
        return (
            jsonify({"error": "'override', 'lovdFile' and 'gnomadFile' parameters are required"}),
            400,
        )

    # Explanation about the parameters:
    # - destination_path: string
    #     - The path to the destination file (where to save it) in the user's workspace
    #       Destination file can either be a new file or an existing file, check its existence
    # - override: boolean
    #     - If true, the existing destination file should be overridden
    #     - If false, the existing destination file should not be overridden and merged
    #       content should be appended
    # - lovd_file: string
    #     - The path to the LOVD file to be used in merge
    # - gnomad_file: string
    #     - The path to the gnomAD file to be used in merge

    destination_path = os.path.join(WORKSPACE_DIR, uuid, relative_path)
    override = request.args.get("override")
    lovd_file = os.path.join(WORKSPACE_DIR, uuid, request.args.get("lovdFile"))
    gnomad_file = os.path.join(WORKSPACE_DIR, uuid, request.args.get("gnomadFile"))

    try:
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "info",
                "message": f"Merging LOVD and gnomAD data to '{relative_path}' with "
                + f"override: '{override}'...",
            },
            uuid,
            sid,
        )

        #
        # TODO: Implement LOVD and gnomAD data merge and save logic using defined parameters
        # [destination_path, override, lovd_file, gnomad_file]
        #

        if os.path.exists(destination_path) and not override:
            return

        if not os.path.exists(destination_path):
            os.makedirs(destination_path)

        if not os.path.exists(lovd_file):
            raise FileNotFoundError(f"LOVD data file not found at: {lovd_file}")

        if not os.path.exists(gnomad_file):
            raise FileNotFoundError(f"gnomAD data file not found at: {gnomad_file}")

        lovd_data = parse_lovd(lovd_file)
        gnomad_data = parse_gnomad(gnomad_file)

        set_lovd_dtypes(lovd_data)
        set_gnomad_dtypes(gnomad_data)

        # Extract "Variants_On_Genome" and merge it with "Variants_On_Transcripts"
        variants_on_genome = lovd_data["Variants_On_Genome"].copy()
        gnomad_data = gnomad_data.copy()

        lovd_data = pd.merge(
            lovd_data["Variants_On_Transcripts"],
            variants_on_genome[['id', 'VariantOnGenome/DNA', 'VariantOnGenome/DNA/hg38']],
            on='id',
            how='left'
        )

        final_data = merge_gnomad_lovd(lovd_data, gnomad_data)

        try:
            final_data.to_csv(destination_path)
        except OSError as e:
            raise RuntimeError(f"Error saving file: {e}")

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "succ",
                "message": f"LOVD and gnomAD merge to '{relative_path}' was successful.",
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
        logger.error("FileNotFoundError: %s while merging LOVD and gnomAD %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while merging LOVD and gnomAD "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while merging LOVD and gnomAD %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while merging LOVD and gnomAD {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error(
            "UnexpectedError: %s while merging LOVD and gnomAD %s", e.message, destination_path
        )
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while merging LOVD and gnomAD "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500

    return jsonify({"message": "LOVD and gnomAD data merge successful"}), 200


@workspace_merge_route_bp.route(
    f"{WORKSPACE_MERGE_ROUTE}/lovd_clinvar/<path:relative_path>", methods=["GET"]
)
def get_workspace_merge_lovd_clinvar(relative_path):
    """
    Route to merge LOVD and ClinVar data and save the merged data to the workspace.
    """

    # Check if 'uuid' and 'sid' are provided in the headers
    if "uuid" not in request.headers or "sid" not in request.headers:
        return jsonify({"error": "UUID and SID headers are required"}), 400

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Check if 'override', 'lovdFile' and 'gnomadFile' are provided
    if (
        "override" not in request.args
        or "lovdFile" not in request.args
        or "clinvarFile" not in request.args
    ):
        return (
            jsonify({"error": "'override', 'lovdFile' and 'clinvarFile' parameters are required"}),
            400,
        )

    # Explanation about the parameters:
    # - destination_path: string
    #     - The path to the destination file (where to save it) in the user's workspace
    #       Destination file can either be a new file or an existing file, check its existence
    # - override: boolean
    #     - If true, the existing destination file should be overridden
    #     - If false, the existing destination file should not be overridden and merged
    #       content should be appended
    # - lovd_file: string
    #     - The path to the LOVD file to be used in merge
    # - clinvar_file: string
    #     - The path to the ClinVar file to be used in merge

    destination_path = os.path.join(WORKSPACE_DIR, uuid, relative_path)
    override = request.args.get("override")
    lovd_file = os.path.join(WORKSPACE_DIR, uuid, request.args.get("lovdFile"))
    clinvar_file = os.path.join(WORKSPACE_DIR, uuid, request.args.get("clinvarFile"))

    try:
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "info",
                "message": f"Merging LOVD and ClinVar data to '{relative_path}' with "
                + f"override: '{override}'...",
            },
            uuid,
            sid,
        )

        #
        # TODO: Implement LOVD and ClinVar data merge and save logic using defined parameters
        # [destination_path, override, lovd_file, clinvar_file]
        #

        # TODO: Remove this sleep statement once the merge logic is implemented
        time.sleep(1)  # Simulate a delay for the merge process

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "succ",
                "message": f"LOVD and ClinVar merge to '{relative_path}' was successful.",
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
        logger.error("FileNotFoundError: %s while merging LOVD and ClinVar %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while merging LOVD and ClinVar "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while merging LOVD and ClinVar %s", e, destination_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while merging LOVD and ClinVar "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error(
            "UnexpectedError: %s while merging LOVD and ClinVar %s", e.message, destination_path
        )
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while merging LOVD and ClinVar "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500

    return jsonify({"message": "LOVD and ClinVar data merge successful"}), 200
