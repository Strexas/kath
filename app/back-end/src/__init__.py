"""
This module sets up and configures a Flask application with various extensions and routing.

The module handles:
- Applying gevent monkey patches to make the standard library cooperative.
- Loading and managing environment variables.
- Configuring application settings such as compression and CORS.
- Initializing Flask extensions, including compression, Socket.IO, CORS, and logging.
- Registering application routes and event handlers.

Dependencies:
- Flask
- gevent.monkey
- src.setup.env.Env: Handles environment variable loading and retrieval.
- src.setup.extensions: Contains the initialized Flask extensions.
- src.setup.router: Manages application routing.
- src.setup.eventer: Registers application events.
- src.setup.constants: Contains application constants like BASE_ROUTE.

Returns:
    Flask: A fully configured Flask application instance.
"""

import gevent.monkey
from flask import Flask

from src.setup.env import Env
from src.setup.extensions import compress, socketio, cors
from src.setup.router import router
from src.setup.eventer import eventer
from src.setup.constants import BASE_ROUTE


def create_app():
    """
    Create and configure the Flask application.

    This function sets up the Flask app by applying necessary monkey patches for gevent,
    loading environment variables, configuring app settings, and initializing various
    Flask extensions such as compression, Socket.IO, CORS, and logging. It also registers
    the application's main routes and event handlers.

    Returns:
        Flask: A fully configured Flask application instance.
    """
    # Apply monkey patches for gevent
    gevent.monkey.patch_all()

    # Load environment variables
    Env.load_env()

    # Set environment variables
    origins = Env.get_origins()

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
        cors_allowed_origins=origins,
        max_http_buffer_size=50 * 1024 * 1024,
    )
    cors.init_app(app, resources={r"*": {"origins": origins}})

    # Register main application routes
    app.register_blueprint(router(BASE_ROUTE))

    # Set up event handlers
    eventer()

    return app
