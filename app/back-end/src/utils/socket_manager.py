import redis


class SocketManager:
    def __init__(self, redis_url="redis://localhost:6379/0", namespace="socket_id_map"):
        self.redis = redis.StrictRedis.from_url(redis_url)
        self.namespace = namespace

    def _get_redis_key(self):
        return f"{self.namespace}"

    def register_user_session(self, uuid, sid):
        self.redis.sadd(f"{self._get_redis_key()}:{uuid}", sid)

    def remove_user_session(self, uuid, sid):
        self.redis.srem(f"{self._get_redis_key()}:{uuid}", sid)

        if self.redis.scard(f"{self._get_redis_key()}:{uuid}") == 0:
            self.redis.delete(f"{self._get_redis_key()}:{uuid}")

    def get_user_sessions(self, uuid):
        sids = self.redis.smembers(f"{self._get_redis_key()}:{uuid}")
        return [sid.decode("utf-8") for sid in sids]

    def get_user_session(self, uuid, sid):
        sids = self.redis.smembers(f"{self._get_redis_key()}:{uuid}")
        return sid if sid in [s.decode("utf-8") for s in sids] else None

    def get_all_sessions(self):
        keys = self.redis.keys(f"{self._get_redis_key()}:*")
        return {
            key.decode("utf-8").split(":")[1]: [
                sid.decode("utf-8") for sid in self.redis.smembers(key)
            ]
            for key in keys
        }

    def remove_all_sessions(self):
        keys = self.redis.keys(f"{self._get_redis_key()}:*")
        for key in keys:
            self.redis.delete(key)
