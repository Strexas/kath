"""
This module defines key project paths and routes used across the application.

It sets up:
- The base directory of the project.
- Source directory path.
- Workspace directory paths, including a template directory.
- Base API route and specific routes for various functionalities.

These constants are typically used for file handling, directory management, and routing in the
Flask application.

Dependencies:
- os: Used for interacting with the operating system to manage file and directory paths.
"""

# pylint: disable=import-error

import os


# Project paths
BASE_DIR = os.path.dirname(os.path.abspath(__name__))
SRC_DIR = os.path.join(BASE_DIR, "src")
WORKSPACE_DIR = os.path.join(SRC_DIR, "workspace")
WORKSPACE_TEMPLATE_DIR = os.path.join(WORKSPACE_DIR, "template")

# Routes
BASE_ROUTE = "/api/v1"
WORKSPACE_ROUTE = "/workspace"
WORKSPACE_FILE_ROUTE = "/workspace/file"
WORKSPACE_CREATE_ROUTE = "/workspace/create"
WORKSPACE_RENAME_ROUTE = "/workspace/rename"
WORKSPACE_DELETE_ROUTE = "/workspace/delete"
WORKSPACE_AGGREGATE_ROUTE = "/workspace/aggregate"
WORKSPACE_IMPORT_ROUTE = "/workspace/import"
WORKSPACE_EXPORT_ROUTE = "/workspace/export"
WORKSPACE_DOWNLOAD_ROUTE = "/workspace/download"
WORKSPACE_MERGE_ROUTE = "/workspace/merge"
WORKSPACE_APPLY_ROUTE = "/workspace/apply"
WORKSPACE_ALIGN_ROUTE = "/workspace/align"

# Events
CONSOLE_FEEDBACK_EVENT = "console_feedback"
WORKSPACE_FILE_SAVE_FEEDBACK_EVENT = "workspace_file_save_feedback"
WORKSPACE_UPDATE_FEEDBACK_EVENT = "workspace_update_feedback"
WOKRSPACE_EXPORT_FEEDBACK_EVENT = "workspace_export_feedback"
