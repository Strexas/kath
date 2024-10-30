"""
Configuration for Gunicorn server used to run the Flask application.

This module provides configuration settings for Gunicorn, including:
- Binding address and port for the server.
- Worker class to handle asynchronous requests.
- Number of worker processes based on the number of CPU cores.

Dependencies:
- multiprocessing: Used to determine the number of CPU cores for configuring the
    number of Gunicorn workers.
- src.setup.env.Env: The class responsible for retrieving environment settings such
    as host and port.
"""

# pylint: disable=invalid-name

import multiprocessing

# Bind to specified host and port
bind = "0.0.0.0:8080"

# Use Gevent worker class for handling asynchronous requests with WebSocket support
worker_class = "geventwebsocket.gunicorn.workers.GeventWebSocketWorker"

# Maximum number of simultaneous connections
worker_connections = 1

# Number of worker processes
workers = multiprocessing.cpu_count() * 2 + 1

# Worker killed and restarted after the specified number of requests
timeout = 600