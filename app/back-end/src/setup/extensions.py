"""
This module sets up and configures logging and initializes key Flask extensions.

The module includes:
- Configuring the logging system to provide consistent log formatting and levels.
- Initializing Flask extensions like `Compress`, `SocketIO`, and `CORS`, which are used 
  throughout the Flask application for compression, real-time communication, and Cross-Origin Resource Sharing (CORS).

Dependencies:
- logging: Python's standard logging module, used for logging messages.
- flask_compress: Flask extension to handle response compression.
- flask_socketio: Flask extension for WebSocket support.
- flask_cors: Flask extension for handling CORS (Cross-Origin Resource Sharing) in the app.
"""

import logging
from flask_compress import Compress
from flask_socketio import SocketIO
from flask_cors import CORS


# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize Flask extensions
compress = Compress()
socketio = SocketIO()
cors = CORS()
