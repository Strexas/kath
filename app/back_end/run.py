"""
This is the entry point for running the Flask application with Socket.IO.

The module performs the following tasks:
- Imports the necessary components to create and run the Flask app.
- Initializes the Flask app using the `create_app` function.
- Retrieves the host and port settings from environment variables.
- Runs the application using Socket.IO for handling WebSocket connections.

Dependencies:
- src.create_app: The function that sets up and returns the configured Flask app instance.
- src.socketio: The Socket.IO instance initialized in the application setup.
- src.setup.env.Env: The class responsible for managing environment variables, including
    retrieving the host and port settings.
"""

# pylint: disable=import-error

from src import create_app, socketio, env

# Initialize the Flask app
app = create_app()

if __name__ == "__main__":
    # Retrieve Flask server host and port from environment variables
    host = env.get_flask_run_host()
    port = env.get_flask_run_port()

    # Run the app with Socket.IO support
    socketio.run(app, debug=True, host=host, port=port)
