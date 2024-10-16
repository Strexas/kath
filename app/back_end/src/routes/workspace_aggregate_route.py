"""
This module defines the routes for aggregating data from user workspaces in a Flask application.
It provides two main routes for performing column-level calculations on CSV files stored in the
user's workspace. The supported operations include summing, averaging, counting, finding the 
minimum, and finding the maximum values in specified columns.

The module emits real-time feedback to the user’s session via Socket.IO, providing status updates 
on the calculations, handling skipped cells due to invalid data, and notifying the user of errors 
such as file not found, permission denied, or unexpected issues.

Routes:
    - get_workspace_aggregate_all(relative_path): 
        Calculates aggregate values (sum, avg, min, max, cnt) for multiple columns in a CSV file.

    - get_workspace_aggregate(relative_path): 
        Calculates an aggregate value (sum, avg, min, max, cnt) for a single column in a CSV file.

Exceptions are handled to provide feedback through the user’s console using Socket.IO.
"""


import os
import csv
from ast import literal_eval
from flask import Blueprint, request, jsonify

from ..setup.extensions import logger
from ..utils.helpers import socketio_emit_to_user_session, is_number
from ..utils.exceptions import UnexpectedError
from ..constants import WORKSPACE_AGGREGATE_ROUTE, CONSOLE_FEEDBACK_EVENT, WORKSPACE_DIR


workspace_aggregate_route_bp = Blueprint("workspace_aggregate_route", __name__)


@workspace_aggregate_route_bp.route(
    f"{WORKSPACE_AGGREGATE_ROUTE}/all/<path:relative_path>", methods=["GET"]
)
def get_workspace_aggregate_all(relative_path):
    """
    Route to calculate aggregate values (e.g., sum, avg, min, max, cnt) for multiple columns
    in a CSV file located in the user's workspace. The columns and their aggregation actions
    are specified in the request's query parameters.

    Args:
        relative_path (str): The relative path to the CSV file inside the user's workspace.

    Request Headers:
        - uuid: A unique identifier for the user's session.
        - sid: A session identifier for emitting real-time console feedback via Socket.IO.

    Query Parameters:
        - columnsAggregation (str): A stringified dictionary where the keys are column names and
          the values are dictionaries with an "action" key specifying the aggregation operation
          ('sum', 'avg', 'min', 'max', or 'cnt').

    Returns:
        Response (JSON):
            - On success: A JSON object with aggregated results for each specified column.
            - On error: A JSON object with an error message and appropriate HTTP status code.

    Emits:
        - Real-time console feedback using Socket.IO via the `socketio_emit_to_user_session`
        function. Feedback includes the start, completion, and any warnings or errors during
        the aggregation process.

    Possible Errors:
        - FileNotFoundError: The specified CSV file does not exist.
        - PermissionError: Insufficient permissions to read the CSV file.
        - UnexpectedError: Any other unexpected error during the aggregation process.
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
                        and header_actions[field] not in ["min", "max", "cnt"]
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
                        "message": "The following columns had cells skipped due to non-numeric "
                        + f"values: {', '.join(skipped_columns_info)}",
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
    """
    Route to calculate an aggregate value (e.g., sum, avg, min, max, cnt) for a single column
    in a CSV file located in the user's workspace. The column and the aggregation action
    are specified in the request's query parameters.

    Args:
        relative_path (str): The relative path to the CSV file inside the user's workspace.

    Request Headers:
        - uuid: A unique identifier for the user's session.
        - sid: A session identifier for emitting real-time console feedback via Socket.IO.

    Query Parameters:
        - field (str): The name of the column to perform the aggregation on.
        - action (str): The type of aggregation action to perform
            ('sum', 'avg', 'min', 'max', or 'cnt').

    Returns:
        Response (JSON):
            - On success: A JSON object with the aggregated result for the specified column.
            - On error: A JSON object with an error message and appropriate HTTP status code.

    Emits:
        - Real-time console feedback using Socket.IO via the `socketio_emit_to_user_session`
            function.Feedback includes the start, completion, and any warnings or errors during the
            aggregation process.

    Possible Errors:
        - FileNotFoundError: The specified CSV file does not exist.
        - PermissionError: Insufficient permissions to read the CSV file.
        - UnexpectedError: Any other unexpected error during the aggregation process.

    Notes:
        - If the column contains non-numeric values, those cells are skipped and a warning is sent
        via Socket.IO.
        - The result is formatted as "N/A" if no valid numeric data is found or if the specified
        action is invalid for the data present in the column.
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
                        "message": f"At column '{field}' {skipped_count} cells "
                        + "were skipped because they contain non-numeric values.",
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
