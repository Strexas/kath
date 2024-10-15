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


import gevent.monkey
from flask import Flask

from src.setup.extensions import socketio, env, compress, cors
from src.setup.router import router
from src.setup.eventer import eventer
from src.constants import BASE_ROUTE


def create_app():
    """
    Create and configure the Flask application.
    This function initializes a Flask application with necessary configurations and extensions.
    It applies gevent monkey patches for cooperative multitasking, sets up application settings
    for compression and CORS, and integrates various Flask extensions such as compression,
    Socket.IO, and CORS. Additionally, it registers the main application routes and sets up
    event handlers.
    Configuration Details:
    - Compression: Enabled for `text/csv` MIME types using gzip with a compression level of 6.
    - Socket.IO: Configured with gevent as the async mode, CORS allowed origins from environment,
        and a Redis message queue.
    - CORS: Applied with origins specified from the environment.
    Returns:
        Flask: A fully configured Flask application instance with extensions initialized,
        routes registered, and event handlers set up.
    """
    # Apply monkey patches for gevent
    gevent.monkey.patch_all()

    # Create Flask app instance
    app = Flask(__name__)

    # Configure app settings
    app.config["COMPRESS_REGISTER"] = False  # disable default compression
    app.config["COMPRESS_MIMETYPES"] = ["text/csv"]
    app.config["COMPRESS_ALGORITHM"] = ["gzip"]
    app.config["COMPRESS_LEVEL"] = 6

    # Initialize Flask extensions with the app instance
    compress.init_app(app)
    socketio.init_app(
        app,
        async_mode="gevent",
        cors_allowed_origins=env.get_origins(),
        message_queue=env.get_redis_url(),
        max_http_buffer_size=50 * 1024 * 1024,
    )
    cors.init_app(app, resources={r"*": {"origins": env.get_origins()}})

    # Set up event handlers
    eventer()

    # Register main application routes
    app.register_blueprint(router(BASE_ROUTE))

    return app



# Initialize the Flask app
app = create_app()

if __name__ == "__main__":
    # Retrieve Flask server host and port from environment variables
    host = env.get_flask_run_host()
    port = env.get_flask_run_port()

    # Run the app with Socket.IO support
    socketio.run(app, debug=True, host=host, port=port)
