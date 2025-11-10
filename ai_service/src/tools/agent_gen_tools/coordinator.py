"""
Координатор агент - определяет намерение пользователя и группу для графа
"""
import json
import logging
from langchain_core.output_parsers import StrOutputParser
from ai_service.src.prompt_engineering.gen_templates import prompt_coordinator
from ai_service.src.utils.states import State
from ai_service.src.llm.openrouter import llm_s

logger = logging.getLogger(__name__)

output = StrOutputParser()
chain = prompt_coordinator | llm_s | output


def coordinator_tool(state: State) -> State:
    """
    Координатор определяет:
    1. Намерение (intent): "course_generation" или "chat"
    2. Тему курса (topic): если intent="course_generation"
    3. Группу (group): тематическая группа для графа
    """
    try:
        query = state.query
        response = chain.invoke({"query": query})
        
        # Парсим JSON ответ
        try:
            # Убираем возможные markdown код блоки
            response_clean = response.strip()
            if response_clean.startswith("```json"):
                response_clean = response_clean[7:]
            if response_clean.startswith("```"):
                response_clean = response_clean[3:]
            if response_clean.endswith("```"):
                response_clean = response_clean[:-3]
            response_clean = response_clean.strip()
            
            coord_data = json.loads(response_clean)
            
            state.intent = coord_data.get("intent", "chat")
            state.topic = coord_data.get("topic")
            state.group = coord_data.get("group")
            
            logger.info(f"Coordinator determined: intent={state.intent}, topic={state.topic}, group={state.group}")
            
        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse coordinator response as JSON: {e}. Response: {response}")
            # Fallback: пытаемся определить по ключевым словам
            query_lower = query.lower()
            if any(word in query_lower for word in ["курс", "тест", "конспект", "видео", "создай", "сделай", "нужен"]):
                state.intent = "course_generation"
                state.topic = query
            else:
                state.intent = "chat"
        
    except Exception as e:
        logger.error(f"Error in coordinator_tool: {e}", exc_info=True)
        # По умолчанию считаем чатом
        state.intent = "chat"
    
    return state