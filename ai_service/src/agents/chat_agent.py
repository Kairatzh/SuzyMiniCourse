"""
Чат агент - для обычного общения с пользователем
"""
import logging
from langchain_core.output_parsers import StrOutputParser
from ai_service.src.prompt_engineering.gen_templates import prompt_chat
from ai_service.src.utils.states import State
from ai_service.src.llm.openrouter import llm_s

logger = logging.getLogger(__name__)

output = StrOutputParser()
chain = prompt_chat | llm_s | output


def chat_agent(state: State) -> State:
    """
    Чат агент обрабатывает обычные вопросы и беседы
    """
    try:
        query = state.query
        response = chain.invoke({"query": query})
        
        if hasattr(response, "content"):
            response = response.content
        response = str(response).strip()
        
        state.chat_response = response
        logger.info(f"Chat agent generated response for query: {query[:50]}...")
        
    except Exception as e:
        logger.error(f"Error in chat_agent: {e}", exc_info=True)
        state.chat_response = f"Извините, произошла ошибка при обработке вашего запроса: {str(e)}"
    
    return state

