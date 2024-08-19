"""
This module is responsible for importing and registering all event modules within the application.

Event modules are imported here to ensure that their event handlers are properly registered when the application initializes.

Dependencies:
- src.events.workspace_event: An event module related to workspace operations.
"""

# Import all event modules here
import src.events.workspace_event


def eventer():
    """
    Register all event handlers.

    This function serves as a placeholder for registering event handlers.
    """
    pass
