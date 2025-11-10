"""
Rate limiting service using Redis or in-memory fallback
"""
import logging
import os
from typing import Optional
from datetime import timedelta

logger = logging.getLogger(__name__)

# Try to import Redis
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    logger.warning("Redis not available, using in-memory rate limiter")

# In-memory fallback storage
_memory_store: dict = {}


class RateLimiter:
    """Rate limiter with Redis backend and in-memory fallback"""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self.use_redis = False
        
        if REDIS_AVAILABLE:
            try:
                redis_host = os.getenv("REDIS_HOST", "localhost")
                redis_port = int(os.getenv("REDIS_PORT", "6379"))
                redis_db = int(os.getenv("REDIS_DB", "0"))
                
                self.redis_client = redis.Redis(
                    host=redis_host,
                    port=redis_port,
                    db=redis_db,
                    decode_responses=True,
                    socket_connect_timeout=2
                )
                # Test connection
                self.redis_client.ping()
                self.use_redis = True
                logger.info("Rate limiter using Redis")
            except Exception as e:
                logger.warning(f"Redis connection failed, using in-memory: {e}")
                self.use_redis = False
    
    def is_allowed(self, key: str, limit: int, window: int) -> bool:
        """
        Check if request is allowed
        
        Args:
            key: Unique identifier (e.g., user_id or ip)
            limit: Maximum number of requests
            window: Time window in seconds
            
        Returns:
            True if allowed, False if rate limited
        """
        if self.use_redis and self.redis_client:
            try:
                current = self.redis_client.get(key)
                if current is None:
                    # First request in window
                    self.redis_client.setex(key, window, "1")
                    return True
                
                count = int(current)
                if count < limit:
                    self.redis_client.incr(key)
                    return True
                else:
                    return False
            except Exception as e:
                logger.error(f"Redis error in rate limiter: {e}")
                # Fallback to in-memory
                return self._is_allowed_memory(key, limit, window)
        else:
            return self._is_allowed_memory(key, limit, window)
    
    def _is_allowed_memory(self, key: str, limit: int, window: int) -> bool:
        """In-memory rate limiter (fallback)"""
        import time
        
        current_time = time.time()
        
        if key not in _memory_store:
            _memory_store[key] = {"count": 1, "window_start": current_time}
            return True
        
        store = _memory_store[key]
        time_passed = current_time - store["window_start"]
        
        if time_passed > window:
            # New window
            _memory_store[key] = {"count": 1, "window_start": current_time}
            return True
        
        if store["count"] < limit:
            store["count"] += 1
            return True
        
        return False


# Global rate limiter instance
rate_limiter = RateLimiter()

