"""
Workspace merge route module.
This module defines routes for merging data from different sources and saving the merged data to
the user's workspace.
"""

# pylint: disable=broad-exception-caught

import os

import time  # TODO: Remove this import once the align logic is implemented

from flask import Blueprint, request, jsonify

from ..setup.extensions import logger
from ..utils.helpers import socketio_emit_to_user_session
from ..utils.exceptions import UnexpectedError
from ..constants import (
    WORKSPACE_ALIGN_ROUTE,
    WORKSPACE_DIR,
    CONSOLE_FEEDBACK_EVENT,
    WORKSPACE_UPDATE_FEEDBACK_EVENT,
)

workspace_align_route_bp = Blueprint("workspace_align_route", __name__)


@workspace_align_route_bp.route(
    f"{WORKSPACE_ALIGN_ROUTE}/fasta_fastq/<path:relative_path>", methods=["GET"]
)
def get_workspace_align_fasta_fastq(relative_path):
    """
    Route to align FASTA and FASTQ data and save the aligned data to the workspace.
    """

    # Check if 'uuid' and 'sid' are provided in the headers
    if "uuid" not in request.headers or "sid" not in request.headers:
        return jsonify({"error": "UUID and SID headers are required"}), 400

    uuid = request.headers.get("uuid")
    sid = request.headers.get("sid")

    # Check if 'fastaFile' and 'fastqFileFolder' are provided
    if (
        "fastaFile" not in request.args
        or "fastqFileFolder" not in request.args
    ):
        return (
            jsonify(
                {
                    "error": "'fastaFile' and 'fastqFileFolder' parameters are required"
                }
            ),
            400,
        )

    # Explanation about the parameters:
    # - destination_path: string
    #     - The path to the destination file (where to save it) in the user's workspace
    # - fasta_file: string
    #     - The path to the FASTA file to be used in align
    # - fastq_file_folder: string
    #     - The path to the FASTQ file folder to be used in align

    destination_path = os.path.join(WORKSPACE_DIR, uuid, relative_path)
    fasta_file = os.path.join(WORKSPACE_DIR, uuid, request.args.get("fastaFile"))
    fastq_file_folder = os.path.join(WORKSPACE_DIR, uuid, request.args.get("fastqFileFolder"))

    try:
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "info",
                "message": f"Aligning FASTA and FASTQ data to '{relative_path}'"
            },
            uuid,
            sid,
        )

        if not os.path.exists(fasta_file):
            raise FileNotFoundError(f"FASTA data file not found at: {fasta_file}")

        if not os.path.exists(fastq_file_folder):
            raise FileNotFoundError(f"FASTQ data not found at: {fastq_file_folder}")
        
        #
        # TODO: Implement FASTA and FASTQ data align and save logic using defined parameters
        # [destination_path, fasta_file, fastq_file_folder]
        #

        # TODO: Remove this sleep statement once the merge logic is implemented
        time.sleep(1)  # Simulate a delay for the merge process

        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "succ",
                "message": f"FASTA and FASTQ align to '{relative_path}' was successful.",
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
            "FileNotFoundError: %s while aligning FASTA and FASTQ %s",
            e,
            destination_path,
        )
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while aligning FASTA and FASTQ "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error(
            "PermissionError: %s while aligning FASTA and FASTQ %s", e, destination_path
        )
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while aligning FASTA and FASTQ {destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error(
            "UnexpectedError: %s while aligning FASTA and FASTQ %s",
            e.message,
            destination_path,
        )
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while aligning FASTA and FASTQ "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500
    except Exception as e:
        logger.error(
            "UnexpectedError: %s while aligning FASTA and FASTQ %s",
            e,
            destination_path,
        )
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e} while aligning FASTA and FASTQ "
                + f"{destination_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500

    return jsonify({"message": "FASTA and FASTQ data align was successful"}), 200