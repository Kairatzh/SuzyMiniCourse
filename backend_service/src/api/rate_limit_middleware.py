"""
Rate limiting middleware for FastAPI
"""
import logging
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from backend_service.src.services.rate_limiter import rate_limiter

logger = logging.getLogger(__name__)


async def rate_limit_middleware(request: Request, call_next):
    """
    Middleware для rate limiting
    
    Лимиты:
    - Генерация курсов: 3 запроса в минуту на пользователя
    - Остальные endpoints: 60 запросов в минуту на IP
    """
    # Получаем идентификатор для rate limiting
    user_id = None
    if hasattr(request.state, "user"):
        user_id = request.state.user.id if request.state.user else None
    
    # Используем user_id если доступен, иначе IP
    if user_id:
        rate_key = f"user:{user_id}"
    else:
        client_host = request.client.host if request.client else "unknown"
        rate_key = f"ip:{client_host}"
    
    # Разные лимиты для разных endpoints
    path = request.url.path
    
    if "/courses/generate" in path:
        # Генерация курсов - более строгий лимит
        limit = 3
        window = 60  # 1 минута
        if not rate_limiter.is_allowed(f"{rate_key}:generate", limit, window):
            logger.warning(f"Rate limit exceeded for {rate_key} on {path}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"Maximum {limit} course generations per minute allowed. Please wait."
                }
            )
    else:
        # Остальные endpoints - стандартный лимит
        limit = 60
        window = 60  # 1 минута
        if not rate_limiter.is_allowed(f"{rate_key}:general", limit, window):
            logger.warning(f"Rate limit exceeded for {rate_key} on {path}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "Rate limit exceeded",
                    "message": "Too many requests. Please try again later."
                }
            )
    
    response = await call_next(request)
    return response

