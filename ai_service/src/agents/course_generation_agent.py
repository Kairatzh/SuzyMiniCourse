"""
Агент генерации курсов - создает конспект, тесты и видео
"""
import logging
from ai_service.src.tools.agent_gen_tools.summary import summary_tool
from ai_service.src.tools.agent_gen_tools.test import gentest_tool
from ai_service.src.tools.agent_gen_tools.videos import video_tool
from ai_service.src.utils.states import State

logger = logging.getLogger(__name__)


def course_generation_agent(state: State) -> State:
    """
    Агент генерации курсов последовательно создает:
    1. Конспект (summary)
    2. Тесты (tests)
    3. Видео (videos)
    """
    try:
        original_query = state.query
        if state.topic:
            state.query = state.topic
        
        logger.info(f"Starting course generation for topic: {state.topic or state.query}")
        
        state = summary_tool(state)
        logger.info("Summary generated")
        
        state = gentest_tool(state)
        logger.info("Tests generated")
        
        state = video_tool(state)
        logger.info("Videos found")
        
        state.query = original_query
        
        logger.info("Course generation completed successfully")
        
    except Exception as e:
        logger.error(f"Error in course_generation_agent: {e}", exc_info=True)
        if not state.summary:
            state.summary = f"Ошибка при генерации конспекта: {str(e)}"
        if not state.tests:
            state.tests = []
        if not state.videos:
            state.videos = []
    
    return state

