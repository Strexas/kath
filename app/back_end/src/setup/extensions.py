"""
This module sets up and configures logging and initializes key Flask extensions for the application.

The module is responsible for:
- Configuring the logging system to provide consistent log formatting and log levels for monitoring
    and debugging.
- Initializing essential Flask extensions including:
    - `Compress`: For handling response compression to improve performance and reduce bandwidth
        usage.
    - `SocketIO`: For real-time communication using WebSocket support.
    - `CORS`: For managing Cross-Origin Resource Sharing (CORS) policies to control access between
        different domains.

Dependencies:
- logging: Python's standard module for logging messages, used to configure logging behavior and
    format.
- flask_compress: Flask extension that provides response compression capabilities.
- flask_socketio: Flask extension that adds WebSocket support and real-time communication.
- flask_cors: Flask extension that handles CORS (Cross-Origin Resource Sharing) to manage
    cross-domain requests.

Initialization:
- **Logging**: Configured to output log messages with a specific format and log level.
- **Env**: An instance of `Env` from `src.config` is used to load environment variables.
- **SocketManager**: Initialized with the Redis URL from environment variables for managing
    WebSocket sessions.
- **Flask Extensions**: Instances of `Compress`, `SocketIO`, and `CORS` are created and ready
    to be integrated into the Flask application.
"""

# pylint: disable=import-error

import logging
from flask_compress import Compress
from flask_socketio import SocketIO
from flask_cors import CORS

from ..config import Env
from ..utils.socket_manager import SocketManager


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] - [%(name)s] - [%(levelname)s] - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize Env and load environment variables
env = Env()
env.load_env()

# Initialize SocketManager
socket_manager = SocketManager(env.get_redis_url())

# Initialize Flask extensions
compress = Compress()
socketio = SocketIO()
cors = CORS()
