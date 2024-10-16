"""
This module defines the `Env` class, which handles environment configuration for the application.

The class manages:
- Loading environment variables from a `.env` file based on the application's environment.
- Retrieving specific environment variables with default fallbacks.
- Providing configuration values for the Flask server, such as host, port, and allowed origins.

Dependencies:
- os: Used for interacting with the operating system to retrieve environment variables.
- dotenv: Used for loading environment variables from a `.env` file.
"""

# pylint: disable=import-error

import os
from dotenv import load_dotenv


class Env:
    """Handles environment configuration and retrieval of environment-specific settings."""

    # Determine the current environment and select the appropriate .env file
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    DOTENV_PATH = {
        "production": ".env.production",
        "development": ".env.development",
    }.get(ENVIRONMENT, ".env.development")

    @classmethod
    def load_env(cls):
        """
        Load environment variables from the appropriate .env file.

        This method uses the `python-dotenv` package to load the environment variables
        from the `.env` file corresponding to the current environment (development or production).
        """
        load_dotenv(cls.DOTENV_PATH)

    @classmethod
    def get(cls, key, default=None):
        """
        Retrieve an environment variable, returning a default value if it's not set.

        Args:
            key (str): The name of the environment variable to retrieve.
            default: The default value to return if the environment variable is not set.

        Returns:
            str: The value of the environment variable, or the default value if not found.
        """
        return os.getenv(key, default)

    @classmethod
    def get_flask_run_host(cls):
        """
        Get the Flask server host from environment variables.

        This is typically used to define the host on which the Flask app will run.

        Returns:
            str: The host address, defaulting to "0.0.0.0".
        """
        return cls.get("FLASK_RUN_HOST", "0.0.0.0")

    @classmethod
    def get_flask_run_port(cls):
        """
        Get the Flask server port from environment variables.

        This is used to define the port on which the Flask app will run.

        Returns:
            int: The port number, defaulting to 8080.
        """
        return cls.get("FLASK_RUN_PORT", 8080)

    @classmethod
    def get_origins(cls):
        """
        Get the list of allowed origins for CORS from environment variables.

        This is used for configuring CORS policies in the Flask app.

        Returns:
            list: A list of origins allowed for CORS, defaulting to ["*"].
        """
        origins = cls.get("ORIGINS", "*")
        return origins.split(",")

    @classmethod
    def get_redis_url(cls):
        """
        Get the Redis URL from environment variables.

        This is used for connecting to the Redis server.

        Returns:
            str: The Redis URL, defaulting to "redis://localhost:6379/0".
        """
        return cls.get("REDIS_URL", "redis://localhost:6379/0")
