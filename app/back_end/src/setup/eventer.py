"""
This module is responsible for importing and registering all event modules within the application.

Event modules are imported to ensure that their event handlers are registered properly when the
application initializes.

It includes the registration of event handlers for Socket.IO events such as user connections and
disconnections.

Dependencies:
- src.events.workspace_event: An event module related to workspace operations, imported to ensure
    its event handlers are registered.

Functions:
- eventer: Registers event handlers for Socket.IO events. Specifically, it handles:
    - "connect": Called when a user connects. It registers the user's session and logs the
        connection.
    - "disconnect": Called when a user disconnects. It removes the user's session and logs the
        disconnection.
  
Details:
- `handle_connect`: Handles the connection event by extracting the UUID from the request,
    registering the user session with `socket_manager`, and logging the event.
- `handle_disconnect`: Handles the disconnection event by removing the user session from
    `socket_manager` and logging the event.

Logging:
- `logger`: Used to log connection and disconnection events, including error messages when no UUID
    is provided.
"""

# pylint: disable=import-error

from flask import request
from ..setup.extensions import socketio, logger, socket_manager

# Import all event modules here
from ..events.workspace_export_event import workspace_export_event_handler


def eventer():
    """
    Register all event handlers including connect and disconnect events.
    """
    workspace_export_event_handler()

    @socketio.on("connect")
    def handle_connect():
        """
        Handle a new Socket.IO connection event.

        This function is triggered when a client establishes a connection to the Socket.IO server.
        It retrieves the user's UUID from the query parameters, registers the user session using
        `socket_manager`, and logs the connection event.

        Process:
        - Extracts the UUID from the query parameters of the connection request.
        - Registers the user's session with the `socket_manager` using the UUID and session ID.
        - Logs the connection event, including the UUID and session ID.

        If no UUID is provided in the connection request, an error is logged indicating the missing
        UUID.

        Logs:
        - Info: When a user successfully connects, including their UUID and session ID.
        - Error: When the UUID is not provided in the connection request.

        Returns:
            None: This function does not return a value. It performs actions based on the connection
                event.
        """
        uuid = request.args.get("uuid")
        if uuid:
            socket_manager.register_user_session(uuid, request.sid)
            logger.info("User %s connected with socket ID %s", uuid, request.sid)
        else:
            logger.error("No uuid provided during connection")

    @socketio.on("disconnect")
    def handle_disconnect():
        """
        Handle a Socket.IO disconnection event.

        This function is triggered when a client disconnects from the Socket.IO server. It retrieves
        the user's UUID from the query parameters, removes the user session using `socket_manager`,
        and logs the disconnection event.

        Process:
        - Extracts the UUID from the query parameters of the disconnection request.
        - Removes the user's session from `socket_manager` using the UUID and session ID.
        - Logs the disconnection event, including the UUID and session ID.

        If no UUID is provided in the disconnection request, an error is logged indicating the
        missing UUID.

        Logs:
        - Info: When a user successfully disconnects, including their UUID and session ID.
        - Error: When the UUID is not provided in the disconnection request.

        Returns:
            None: This function does not return a value. It performs actions based on the
                disconnection event.
        """
        uuid = request.args.get("uuid")
        if uuid:
            socket_manager.remove_user_session(uuid, request.sid)
            logger.info("User %s disconnected with socket ID %s", uuid, request.sid)
        else:
            logger.error("No uuid provided during disconnection")
