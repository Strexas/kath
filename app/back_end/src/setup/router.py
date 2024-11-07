"""
This module defines the router setup for the Flask application.

It is responsible for:
- Creating a main blueprint (`router_bp`) that serves as the central point for registering
    other route blueprints.
- Registering all the individual route blueprints with a specified URL prefix.

Dependencies:
- flask.Blueprint: Used to create the main router blueprint.
- src.routes.workspace_route: Contains the blueprint for workspace-related routes.
"""

# pylint: disable=import-error

from flask import Blueprint

from ..routes.workspace_route import workspace_route_bp
from ..routes.workspace_aggregate_route import workspace_aggregate_route_bp
from ..routes.workspace_export_route import workspace_export_route_bp
from ..routes.workspace_import_route import workspace_import_route_bp
from ..routes.workspace_download_route import workspace_download_route_bp
from ..routes.workspace_merge_route import workspace_merge_route_bp
from ..routes.workspace_apply_route import workspace_apply_route_bp
from ..routes.workspace_align_route import workspace_align_route_bp


def router(prefix):
    """
    Create and configure the main router blueprint.

    This function sets up the main router blueprint, which serves as the central
    point for registering other route blueprints.

    Args:
        prefix (str): The URL prefix to be applied to all routes registered with this blueprint.

    Returns:
        Blueprint: The configured Flask blueprint with all the registered routes.
    """
    router_bp = Blueprint("router", __name__, url_prefix=prefix)

    # Register API routes with the main router blueprint
    router_bp.register_blueprint(workspace_apply_route_bp)
    router_bp.register_blueprint(workspace_align_route_bp)
    router_bp.register_blueprint(workspace_merge_route_bp)
    router_bp.register_blueprint(workspace_download_route_bp)
    router_bp.register_blueprint(workspace_export_route_bp)
    router_bp.register_blueprint(workspace_import_route_bp)
    router_bp.register_blueprint(workspace_aggregate_route_bp)
    router_bp.register_blueprint(workspace_route_bp)

    return router_bp
