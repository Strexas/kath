"""
This module contains functions for handling workspace-related WebSocket events.

It includes functions that manage file operations within the workspace directory. The module
provides real-time feedback to clients through WebSocket events.

Dependencies:
- os: Used for file and directory operations.
- src.setup.extensions.socketio: The Socket.IO instance used for handling real-time communication.
- src.setup.constants.WORKSPACE_DIR: The base directory for workspace files.
"""

# pylint: disable=import-error

import os
from flask_socketio import SocketIO

from src.utils.exceptions import UnexpectedError
from src.constants import WORKSPACE_DIR


def workspace_event_handler(socketio: SocketIO):
    """
    Registers WebSocket event handlers for workspace operations using the provided SocketIO
    instance.

    This function sets up event handling for the 'workspace_file_update' event, which allows
    clients to update files in the workspace directory. It verifies the presence of necessary
    data (UUID and file ID), handles file writing, and provides status updates back to the client.

    Args:
        socketio (SocketIO): The SocketIO instance used for managing WebSocket connections and
            events.

    Events Handled:
        - 'workspace_file_update': Processes file update requests and emits status updates.

    Emits:
        - 'workspace_file_update_status': Indicates success or failure of the file update operation
            with a status message.
    """

    @socketio.on("workspace_file_update")
    def handle_workspace_file_update(data):
        """
        Handle the 'workspace_file_update' WebSocket event.

        This function processes the data received from the client to update a file in the workspace
        directory. It ensures that required fields are present, writes the content to the specified
        file, and handles any errors by sending appropriate status updates back to the client.

        Args:
            data (dict): The data received from the client, expected to contain 'uuid', 'fileId',
            and 'content'.

        Emits:
            'workspace_file_update_status': Emits a status message indicating success or failure of
                the file update operation.
        """
        uuid = data.get("uuid")
        file_id = data.get("fileId")
        content = data.get("content")

        # Ensure the uuid is provided
        if not uuid:
            socketio.emit(
                "workspace_file_update_status",
                {"status": "error", "message": "UUID is missing"},
            )
            return

        # Ensure the fileId is provided
        if not file_id:
            socketio.emit(
                "workspace_file_update_status",
                {"status": "error", "message": "File ID is missing"},
            )
            return

        file_path = os.path.join(WORKSPACE_DIR, uuid, file_id)

        try:
            # Ensure the directory exists
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            # Write the content to the file
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(content)

            # Notify the client of the successful update
            socketio.emit("workspace_file_update_status", {"status": "success"})

        except UnexpectedError as e:
            # Notify the client of an error during the update
            socketio.emit("workspace_file_update_status", {"status": "error", "message": str(e)})
