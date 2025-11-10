"""
Router for course generation endpoints
"""

from fastapi import APIRouter, HTTPException, status
from ai_service.src.agents.agent_gen import generate_c
from ai_service.api.schemas.generate_sch import (
    CourseGenerateRequest,
    CourseGenerateResponse,
    ErrorResponse
)
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/generate_main", tags=["Course Generation"])


def _convert_state_to_response(state: Any) -> Dict[str, Any]:
    """
    Конвертирует State в словарь для ответа API
    Совместим с форматом, ожидаемым backend сервисом
    """
    try:
        if hasattr(state, 'query'):
            return {
                "query": state.query or "",
                "intent": getattr(state, 'intent', None),
                "topic": getattr(state, 'topic', None),
                "group": getattr(state, 'group', None),
                "summary": getattr(state, 'summary', None),
                "tests": state.tests if isinstance(state.tests, list) else [],
                "videos": state.videos if isinstance(state.videos, list) else [],
                "chat_response": getattr(state, 'chat_response', None)
            }
        elif isinstance(state, dict):
            return {
                "query": state.get("query", ""),
                "intent": state.get("intent"),
                "topic": state.get("topic"),
                "group": state.get("group"),
                "summary": state.get("summary"),
                "tests": state.get("tests", []),
                "videos": state.get("videos", []),
                "chat_response": state.get("chat_response")
            }
        else:
            return {
                "query": "",
                "intent": None,
                "topic": None,
                "group": None,
                "summary": None,
                "tests": [],
                "videos": [],
                "chat_response": None
            }
    except Exception as e:
        logger.error(f"Error converting state to response: {e}")
        raise


@router.post(
    "/generate",
    response_model=CourseGenerateResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse, "description": "Bad request"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Generate a course or chat",
    description="""
    Обрабатывает запрос пользователя через координатор агента.
    
    Координатор определяет намерение:
    - "course_generation": генерирует курс (конспект, тесты, видео)
    - "chat": отвечает на вопрос в режиме чата
    
    Для генерации курса:
    1. Определяется тема и тематическая группа
    2. Генерируется конспект
    3. Создаются тестовые вопросы
    4. Ищутся релевантные YouTube видео
    
    **Note**: Генерация может занять 30-60 секунд в зависимости от сложности темы.
    """
)
async def generate_course(request: CourseGenerateRequest):
    try:
        logger.info(f"Starting course generation for query: {request.query}")
        
        result = generate_c(request.query)
        
        response_data = _convert_state_to_response(result)
        
        if not response_data.get("query"):
            response_data["query"] = request.query
        
        logger.info(f"Course generation completed for query: {request.query}")
        
        return CourseGenerateResponse(**response_data)
        
    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error during course generation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate course: {str(e)}"
        )


@router.get(
    "/health",
    summary="Health check for generation service",
    description="Check if the course generation service is available"
)
async def generation_health_check():
    return {
        "status": "healthy",
        "service": "course-generation",
        "endpoints": {
            "generate": "/api/v1/generate_main/generate"
        }
    }
