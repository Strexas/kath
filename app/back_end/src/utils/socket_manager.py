"""
This module provides the `SocketManager` class for managing WebSocket user sessions using Redis.

The `SocketManager` class is responsible for:
- Registering user sessions by associating a user UUID with a socket ID.
- Removing user sessions when users disconnect.
- Retrieving active sessions for a specific user or all users.

Dependencies:
- redis: Python Redis client for interacting with the Redis store.

Usage:
    socket_manager = SocketManager(redis_url="redis://localhost:6379/0")
    socket_manager.register_user_session(uuid, sid)
    sessions = socket_manager.get_user_sessions(uuid)
"""

# pylint: disable=import-error

import redis


class SocketManager:
    """
    Manages WebSocket user sessions using Redis as a backend.

    This class provides methods to register, remove, and retrieve user sessions
    associated with WebSocket connections. It uses Redis to store session data,
    enabling efficient management and retrieval of session information.

    Attributes:
        redis (StrictRedis): A Redis client for interacting with the Redis store.
        namespace (str): A namespace used as a prefix for Redis keys to avoid key collisions.

    Methods:
        register_user_session(uuid, sid): Registers a socket ID (sid) for a given user UUID.
        remove_user_session(uuid, sid): Removes a socket ID (sid) from a given user UUID.
        get_user_sessions(uuid): Retrieves all socket IDs associated with a given user UUID.
        get_user_session(uuid, sid): Checks if a specific socket ID (sid) exists for a given user
            UUID.
        get_all_sessions(): Retrieves all active sessions for all users.
        remove_all_sessions(): Removes all stored sessions in the namespace.
    """

    def __init__(
        self,
        redis_url="redis://localhost:6379/0",
        namespace="socket_id_map",
    ):
        """
        Initializes the SocketManager with a connection to a Redis instance and a specified
        namespace.

        Args:
            redis_url (str): The URL of the Redis instance to connect to. Defaults
                to "redis://localhost:6379/0".
            namespace (str): The namespace used as a prefix for Redis keys to prevent key
                collisions. Defaults to "socket_id_map".

        Attributes:
            redis (StrictRedis): A Redis client instance for performing operations in the
                Redis store.
            namespace (str): The namespace that will be used to prefix all Redis keys associated
                with user sessions.
        """
        self.redis = redis.StrictRedis.from_url(redis_url)
        self.namespace = namespace

    def _get_redis_key(self):
        """
        Constructs the base Redis key using the defined namespace.

        Returns:
            str: The base Redis key, which is the namespace used for all user session keys.
        """
        return f"{self.namespace}"

    def register_user_session(self, uuid, sid):
        """
        Registers a user's session ID (sid) in Redis under their unique identifier (uuid).

        This method adds the session ID to a Redis set associated with the user's UUID,
        allowing for multiple active sessions per user.

        Args:
            uuid (str): The unique identifier for the user.
            sid (str): The session ID to be associated with the user's UUID.

        Returns:
            None
        """
        self.redis.sadd(f"{self._get_redis_key()}:{uuid}", sid)

    def remove_user_session(self, uuid, sid):
        """
        Removes a user's session ID (sid) from Redis.

        This method removes the specified session ID from the Redis set associated with
        the user's UUID. If the set becomes empty after removal, the set is deleted.

        Args:
            uuid (str): The unique identifier for the user.
            sid (str): The session ID to be removed from the user's session set.

        Returns:
            None
        """
        self.redis.srem(f"{self._get_redis_key()}:{uuid}", sid)

        if self.redis.scard(f"{self._get_redis_key()}:{uuid}") == 0:
            self.redis.delete(f"{self._get_redis_key()}:{uuid}")

    def get_user_sessions(self, uuid):
        """
        Retrieves a list of session IDs for a given user UUID.

        This method fetches all session IDs associated with the specified user UUID
        from Redis and decodes them from bytes to strings.

        Args:
            uuid (str): The unique identifier for the user.

        Returns:
            list: A list of session IDs (strings) associated with the given UUID.
        """
        sids = self.redis.smembers(f"{self._get_redis_key()}:{uuid}")
        return [sid.decode("utf-8") for sid in sids]

    def get_user_session(self, uuid, sid):
        """
        Checks if a specific session ID exists for a given user UUID.

        This method retrieves all session IDs associated with the specified user UUID
        from Redis and checks if the provided session ID is among them. It returns
        the session ID if it exists, otherwise it returns None.

        Args:
            uuid (str): The unique identifier for the user.
            sid (str): The session ID to check.

        Returns:
            str or None: The session ID if it exists for the given UUID, otherwise None.
        """
        sids = self.redis.smembers(f"{self._get_redis_key()}:{uuid}")
        return sid if sid in [s.decode("utf-8") for s in sids] else None

    def get_all_sessions(self):
        """
        Retrieves all user sessions from Redis.

        This method fetches all keys matching the pattern for user sessions and
        constructs a dictionary where each key is a user UUID and the value is
        a list of session IDs associated with that UUID.

        Returns:
            dict: A dictionary mapping user UUIDs to lists of session IDs. Each key
                  is a UUID, and the value is a list of session IDs (strings) for that UUID.
        """
        keys = self.redis.keys(f"{self._get_redis_key()}:*")
        return {
            key.decode("utf-8").split(":")[1]: [
                sid.decode("utf-8") for sid in self.redis.smembers(key)
            ]
            for key in keys
        }

    def remove_all_sessions(self):
        """
        Removes all user sessions from Redis.

        This method deletes all session keys from Redis that match the pattern
        for user sessions. This operation clears out all stored session information
        for all users.

        Returns:
            None: This method does not return any value. It performs the action of
                  deleting the session data.
        """
        keys = self.redis.keys(f"{self._get_redis_key()}:*")
        for key in keys:
            self.redis.delete(key)
