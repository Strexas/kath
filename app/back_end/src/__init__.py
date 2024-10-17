"""
This module sets up and configures a Flask application with various extensions and routing.

The module is responsible for:
- Applying gevent monkey patches to enable cooperative multitasking with the standard library.
- Loading environment variables to configure app settings.
- Configuring application settings such as compression and CORS policies.
- Initializing Flask extensions including compression, Socket.IO, and CORS.
- Registering application routes and event handlers.

Dependencies:
- Flask: The core web framework.
- gevent.monkey: Provides monkey patches to enable cooperative multitasking.
- src.setup.extensions: Contains initialization for Flask extensions like compression, Socket.IO,
    and CORS.
- src.setup.router: Defines and manages application routing through blueprints.
- src.setup.eventer: Sets up event handlers for application events.
- src.constants: Provides constants used in configuration, such as BASE_ROUTE.

Returns:
    Flask: A fully configured Flask application instance with all extensions and routes initialized.
"""

# pylint: disable=import-error

import gevent.monkey
from flask import Flask

from .setup.extensions import compress, socketio, cors, env
from .setup.router import router
from .setup.eventer import eventer
from .constants import BASE_ROUTE


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
