# pylint: disable=import-error

import os
import csv
from flask import Blueprint, request, jsonify
from ast import literal_eval

from src.setup.extensions import logger
from src.utils.helpers import socketio_emit_to_user_session, is_number
from src.utils.exceptions import UnexpectedError
from src.constants import WORKSPACE_AGGREGATE_ROUTE, CONSOLE_FEEDBACK_EVENT, WORKSPACE_DIR


workspace_aggregate_route_bp = Blueprint("workspace_aggregate_route", __name__)


@workspace_aggregate_route_bp.route(
    f"{WORKSPACE_AGGREGATE_ROUTE}/all/<path:relative_path>", methods=["GET"]
)
def get_workspace_aggregate_all(relative_path):
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
        {"type": "info", "message": f"Calculating all file at '{relative_path}'..."},
        uuid,
        sid,
    )

    user_workspace_dir = os.path.join(WORKSPACE_DIR, uuid)
    file_path = os.path.join(user_workspace_dir, relative_path)

    columns_aggregation = request.args.get("columnsAggregation")
    columns_aggregation = literal_eval(columns_aggregation)
    header_actions = {
        field: columns_aggregation[field]["action"] for field in columns_aggregation.keys()
    }
    header_values = {
        field: (
            float("inf")
            if columns_aggregation[field]["action"] == "min"
            else float("-inf") if columns_aggregation[field]["action"] == "max" else float(0)
        )
        for field in columns_aggregation.keys()
    }
    skipped_counts = {field: 0 for field in columns_aggregation.keys()}
    counts = {field: 0 for field in columns_aggregation.keys()}

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            reader = csv.reader(file)
            header = next(reader)

            if header:
                for row in reader:
                    for field in columns_aggregation.keys():

                        header_index = header.index(field)
                        if header_index >= len(row):
                            skipped_counts[field] += 1
                            continue

                        action = header_actions[field]
                        value = row[header_index]
                        if action == "cnt":
                            if value:
                                header_values[field] += float(1)
                            else:
                                skipped_counts[field] += 1
                        elif is_number(value):
                            if action == "sum":
                                header_values[field] += float(value)
                            elif action == "avg":
                                header_values[field] += float(value)
                                counts[field] += 1
                            elif action == "min":
                                header_values[field] = min(header_values[field], float(value))
                            elif action == "max":
                                header_values[field] = max(header_values[field], float(value))
                        else:
                            skipped_counts[field] += 1

            for field in columns_aggregation.keys():
                action = header_actions[field]
                if action == "avg":
                    if counts[field] != 0:
                        header_values[field] /= counts[field]

            # Format the values for the response
            formatted_values = {
                field: (
                    "N/A"
                    if header_values[field] == float("inf")
                    or header_values[field] == float("-inf")
                    or (
                        header_values[field] == float(0)
                        and (
                            header_actions[field] != "min"
                            or header_actions[field] != "max"
                            or header_actions[field] != "cnt"
                        )
                    )
                    else (
                        str(int(header_values[field]))
                        if isinstance(header_values[field], (int, float))
                        and header_values[field].is_integer()
                        else f"{header_values[field]:.3f}"
                    )
                )
                for field in columns_aggregation.keys()
            }

            # Build the response data
            response_data = {
                "fileId": relative_path,
                "columnsAggregation": {
                    field: {
                        "action": columns_aggregation[field]["action"],
                        "value": formatted_values[field],
                    }
                    for field in columns_aggregation.keys()
                },
            }

            # Emit a feedback to the user's console
            skipped_columns_info = []
            for field in columns_aggregation.keys():
                skipped_count = skipped_counts[field]
                if skipped_count != 0:
                    skipped_columns_info.append(f"'{field}': {skipped_count} cells")

            if skipped_columns_info:
                socketio_emit_to_user_session(
                    CONSOLE_FEEDBACK_EVENT,
                    {
                        "type": "warn",
                        "message": f"The following columns had cells skipped due to non-numeric values: {', '.join(skipped_columns_info)}",
                    },
                    uuid,
                    sid,
                )

            socketio_emit_to_user_session(
                CONSOLE_FEEDBACK_EVENT,
                {
                    "type": "succ",
                    "message": f"File at '{relative_path}' all calculated successfully.",
                },
                uuid,
                sid,
            )

            return jsonify(response_data)

    except FileNotFoundError as e:
        logger.error("FileNotFoundError: %s while calculating all %s", e, file_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while calculating all {file_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while calculating all %s", e, file_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while calculating all {file_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error("UnexpectedError: %s while calculating all %s", e.message, file_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while calculating all {file_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500


@workspace_aggregate_route_bp.route(
    f"{WORKSPACE_AGGREGATE_ROUTE}/<path:relative_path>", methods=["GET"]
)
def get_workspace_aggregate(relative_path):
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
        {"type": "info", "message": f"Calculating file at '{relative_path}'..."},
        uuid,
        sid,
    )

    user_workspace_dir = os.path.join(WORKSPACE_DIR, uuid)
    file_path = os.path.join(user_workspace_dir, relative_path)

    field = request.args.get("field")
    action = request.args.get("action")
    result = float("inf") if action == "min" else float("-inf") if action == "max" else float(0)
    count = 0
    skipped_count = 0

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            reader = csv.reader(file)
            header = next(reader)

            if header:
                if field not in header:
                    # Emit a feedback to the user's console
                    socketio_emit_to_user_session(
                        CONSOLE_FEEDBACK_EVENT,
                        {
                            "type": "errr",
                            "message": f"Column '{field}' not found in the file '{relative_path}'",
                        },
                        uuid,
                        sid,
                    )
                    return (
                        jsonify(
                            {"error": f"Column '{field}' not found in the file '{relative_path}'"}
                        ),
                        404,
                    )

                for row in reader:
                    header_index = header.index(field)
                    if header_index >= len(row):
                        skipped_count += 1
                        continue

                    value = row[header_index]
                    if action == "cnt":
                        if value:
                            result += float(1)
                        else:
                            skipped_count += 1
                    elif is_number(value):
                        if action == "sum":
                            result += float(value)
                        elif action == "avg":
                            result += float(value)
                            count += 1
                        elif action == "min":
                            result = min(result, float(value))
                        elif action == "max":
                            result = max(result, float(value))
                    else:
                        skipped_count += 1

                if action == "avg" and count != 0:
                    result /= count

            # Emit a feedback to the user's console
            if skipped_count != 0:
                socketio_emit_to_user_session(
                    CONSOLE_FEEDBACK_EVENT,
                    {
                        "type": "warn",
                        "message": f"At column '{field}' {skipped_count} cells were skipped because they contain non-numeric values.",
                    },
                    uuid,
                    sid,
                )

            socketio_emit_to_user_session(
                CONSOLE_FEEDBACK_EVENT,
                {
                    "type": "succ",
                    "message": f"File at '{relative_path}' calculated successfully.",
                },
                uuid,
                sid,
            )

            formatted_value = (
                "N/A"
                if result == float("inf")
                or result == float("-inf")
                or (result == float(0) and action not in ["min", "max", "cnt"])
                else str(int(result)) if result.is_integer() else f"{result:.3f}"
            )

            # Build the response data
            response_data = {
                "fileId": relative_path,
                "field": field,
                "action": action,
                "value": formatted_value,
            }

            return jsonify(response_data)

    except FileNotFoundError as e:
        logger.error("FileNotFoundError: %s while calculating %s", e, file_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"FileNotFoundError: {e} while calculating {file_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Requested file not found"}), 404
    except PermissionError as e:
        logger.error("PermissionError: %s while calculating %s", e, file_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"PermissionError: {e} while calculating {file_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "Permission denied"}), 403
    except UnexpectedError as e:
        logger.error("UnexpectedError: %s while calculating %s", e.message, file_path)
        # Emit a feedback to the user's console
        socketio_emit_to_user_session(
            CONSOLE_FEEDBACK_EVENT,
            {
                "type": "errr",
                "message": f"UnexpectedError: {e.message} while calculating {file_path}",
            },
            uuid,
            sid,
        )
        return jsonify({"error": "An internal error occurred"}), 500
