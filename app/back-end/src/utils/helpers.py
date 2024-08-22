"""
This package provides utilities for handling Socket.IO events and managing workspace directory
structures.

Functions:
- socketio_emit_to_user_session: Sends a Socket.IO event to a specific user session. The event data 
    is augmented with a timestamp indicating the current time.
- build_workspace_structure: Recursively builds a dictionary representation of a directory structure 
    for a given workspace. It includes metadata about files and directories and provides a
    hierarchical view of the workspace.

Dependencies:
- os: Provides a way to interact with the operating system, including filesystem operations.
- datetime: Supplies classes for manipulating dates and times.
- src.setup.extensions: Contains `socketio` and `socket_manager` used for emitting events and
    managing user sessions in Socket.IO.

Details:
- `socketio_emit_to_user_session` emits an event to a specific user session identified by UUID
    and session ID (SID).
- `build_workspace_structure` generates a nested dictionary structure representing the directories
    and files within a workspace, providing metadata such as labels and types.

Usage:
- Use `socketio_emit_to_user_session` to communicate with specific user sessions through Socket.IO.
- Use `build_workspace_structure` to construct a detailed, recursive view of a directory structure
    for applications requiring hierarchical data representation.

No classes or modules are directly exposed by this package, only the utility functions defined
above.
"""

# pylint: disable=import-error

import os
from datetime import datetime

from src.setup.extensions import socketio, socket_manager


def socketio_emit_to_user_session(event, data, uuid, sid):
    """
    Emit an event to a specific user session via Socket.IO.

    This function sends a Socket.IO event to a user session identified by the provided
    UUID and session ID (SID). The event data is augmented with a timestamp indicating
    the current time when the event is emitted.

    Args:
        event (str): The name of the event to emit. This is a string that identifies the
            event type or action.
        data (dict): A dictionary containing the data to send with the event. This data
            will be included in the event payload.
        uuid (str): The unique identifier of the user whose session should receive the event.
        sid (str): The session ID of the user session to target.

    Returns:
        None: This function does not return a value. It performs an action by emitting
            an event to the specified Socket.IO user session.
    """
    socketio.emit(
        event,
        {
            **data,
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        },
        to=socket_manager.get_user_session(uuid, sid),
    )


def build_workspace_structure(path, user_workspace_dir):
    """
    Recursively build the directory structure for the workspace.

    This function generates a nested dictionary representing the structure of the directory
    specified by `path`. It distinguishes between files and directories, and includes metadata
    such as labels and file types. The structure is built relative to the `user_workspace_dir`
    directory, which serves as the root of the workspace.

    Args:
        path (str): The current directory path to build the structure from. This should be an
            absolute or relative path to a directory or file.
        user_workspace_dir (str): The root directory of the user's workspace. This is used to
            determine the relative path for each item in the structure.

    Returns:
        dict: A dictionary representing the directory structure. Each entry contains:
            - "id" (str): # The relative path of the item from the `user_workspace_dir`.
            - "label" (str): # The name of the file or directory.
            - "fileType" (str): # The type of the item, either "folder" for directories or "csv"
                for files.
            - "children" (list): # A list of child items, which is empty for files and populated
                with nested dictionaries for directories.
    """
    workspace_structure = {
        "id": os.path.relpath(path, user_workspace_dir),
        "label": os.path.basename(path),
        "fileType": "folder" if os.path.isdir(path) else "csv",
        "children": [],
    }

    if os.path.isdir(path):
        workspace_structure["children"] = [
            build_workspace_structure(os.path.join(path, child), user_workspace_dir)
            for child in os.listdir(path)
        ]

    return workspace_structure
