"""
Module for handling Socket.IO events related to workspace file exports.

This module sets up the event handler for the `WOKRSPACE_EXPORT_FEEDBACK_EVENT` event using
Socket.IO. It processes feedback about file export operations and sends appropriate real-time
feedback messages to the user's console based on the status of the export operation.

Imports:
    - socketio: The Socket.IO instance for handling real-time communication.
    - socketio_emit_to_user_session: Utility function for emitting messages to a user's session.
    - WOKRSPACE_EXPORT_FEEDBACK_EVENT: Constant defining the event name for file export feedback.
    - CONSOLE_FEEDBACK_EVENT: Constant defining the event name for console feedback.

Functions:
    - workspace_export_event_handler: Registers the Socket.IO event handler for file export
    feedback.
"""

# pylint: disable=import-error

from ..setup.extensions import socketio
from ..utils.helpers import socketio_emit_to_user_session
from ..constants import WOKRSPACE_EXPORT_FEEDBACK_EVENT, CONSOLE_FEEDBACK_EVENT


def workspace_export_event_handler():
    """
    Sets up the event handler for the `WOKRSPACE_EXPORT_FEEDBACK_EVENT` event in Socket.IO.

    This function registers an event handler for the `WOKRSPACE_EXPORT_FEEDBACK_EVENT` event,
    which is triggered during file export operations in the workspace. The event handler processes
    the feedback based on the status of the file export operation and sends appropriate feedback
    messages to the user's console.

    This function does not return any value. It directly interacts with the Socket.IO event system
    to provide real-time feedback to users.

    Side Effects:
        - Registers the `handle_workspace_export_feedback` function as an event handler for
          `WOKRSPACE_EXPORT_FEEDBACK_EVENT` using Socket.IO.
    """

    @socketio.on(WOKRSPACE_EXPORT_FEEDBACK_EVENT)
    def handle_workspace_export_feedback(data):
        """
        Handles the `WOKRSPACE_EXPORT_FEEDBACK_EVENT` event by providing feedback about the
        file export operation.

        This function listens for Socket.IO events related to workspace file exports and processes
        the feedback based on the status provided in the event data. It then sends a message to the
        user's console indicating whether the file export was successful or not.

        Args:
            data (dict): The event data containing feedback about the file export operation.
            It should include:
                - `status` (str): The status of the file export operation ("success" or "failure").
                - `uuid` (str): The unique identifier for the user's session.
                - `sid` (str): The session identifier used for emitting real-time feedback.
                - `fileName` (str): The name of the file that is being exported.

        Emits:
            - Success message to the user's console if the status is "success".
            - Error message to the user's console if the status is "failure".

        Side Effects:
            - Sends real-time feedback to the user's console using `socketio_emit_to_user_session`.
        """

        if data["status"] == "success":
            socketio_emit_to_user_session(
                CONSOLE_FEEDBACK_EVENT,
                {"type": "succ",
                 "message": f"File '{data['filePath']}' export was completed successfully."},
                data["uuid"],
                data["sid"],
            )
        else:
            socketio_emit_to_user_session(
                CONSOLE_FEEDBACK_EVENT,
                {"type": "errr", "message": f"File '{data['filePath']}' export failed."},
                data["uuid"],
                data["sid"],
            )
