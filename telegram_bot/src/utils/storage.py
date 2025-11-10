"""
Storage for user sessions with Redis backend and in-memory fallback
"""
import logging
import os
import json
from typing import Dict, Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Try to import Redis
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    logger.warning("Redis not available, using in-memory storage")

# In-memory fallback storage
_user_tokens: Dict[int, str] = {}
_user_states: Dict[int, Dict] = {}
_processing_users: set = set()  # Track users currently processing requests

# Redis client (if available)
_redis_client: Optional[redis.Redis] = None
_use_redis = False

# Initialize Redis if available
if REDIS_AVAILABLE:
    try:
        redis_host = os.getenv("REDIS_HOST", "localhost")
        redis_port = int(os.getenv("REDIS_PORT", "6379"))
        redis_db = int(os.getenv("REDIS_DB", "0"))
        
        _redis_client = redis.Redis(
            host=redis_host,
            port=redis_port,
            db=redis_db,
            decode_responses=True,
            socket_connect_timeout=2
        )
        # Test connection
        _redis_client.ping()
        _use_redis = True
        logger.info("Storage using Redis")
    except Exception as e:
        logger.warning(f"Redis connection failed, using in-memory storage: {e}")
        _use_redis = False


def save_token(user_id: int, token: str, ttl: int = 86400):
    """Save user token (24h TTL by default)"""
    if _use_redis and _redis_client:
        try:
            _redis_client.setex(f"token:{user_id}", ttl, token)
        except Exception as e:
            logger.error(f"Redis error saving token: {e}")
            # Fallback to memory
            _user_tokens[user_id] = token
    else:
        _user_tokens[user_id] = token


def get_token(user_id: int) -> Optional[str]:
    """Get user token"""
    if _use_redis and _redis_client:
        try:
            return _redis_client.get(f"token:{user_id}")
        except Exception as e:
            logger.error(f"Redis error getting token: {e}")
            return _user_tokens.get(user_id)
    else:
        return _user_tokens.get(user_id)


def clear_token(user_id: int):
    """Clear user token"""
    if _use_redis and _redis_client:
        try:
            _redis_client.delete(f"token:{user_id}")
        except Exception as e:
            logger.error(f"Redis error clearing token: {e}")
            if user_id in _user_tokens:
                del _user_tokens[user_id]
    else:
        if user_id in _user_tokens:
            del _user_tokens[user_id]


def save_state(user_id: int, state: Dict, ttl: int = 3600):
    """Save user state (1h TTL by default)"""
    if _use_redis and _redis_client:
        try:
            _redis_client.setex(f"state:{user_id}", ttl, json.dumps(state))
        except Exception as e:
            logger.error(f"Redis error saving state: {e}")
            _user_states[user_id] = state
    else:
        _user_states[user_id] = state


def get_state(user_id: int) -> Optional[Dict]:
    """Get user state"""
    if _use_redis and _redis_client:
        try:
            state_str = _redis_client.get(f"state:{user_id}")
            if state_str:
                return json.loads(state_str)
            return None
        except Exception as e:
            logger.error(f"Redis error getting state: {e}")
            return _user_states.get(user_id)
    else:
        return _user_states.get(user_id)


def clear_state(user_id: int):
    """Clear user state"""
    if _use_redis and _redis_client:
        try:
            _redis_client.delete(f"state:{user_id}")
        except Exception as e:
            logger.error(f"Redis error clearing state: {e}")
            if user_id in _user_states:
                del _user_states[user_id]
    else:
        if user_id in _user_states:
            del _user_states[user_id]


def is_processing(user_id: int) -> bool:
    """Check if user is currently processing a request"""
    return user_id in _processing_users


def set_processing(user_id: int, value: bool):
    """Set processing status for user"""
    if value:
        _processing_users.add(user_id)
    else:
        _processing_users.discard(user_id)

