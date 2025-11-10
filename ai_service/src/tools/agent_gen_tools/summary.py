"""
Модуль для генерации конспектов на определенную тему 
"""
import logging
from langchain_core.output_parsers import StrOutputParser
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from ai_service.src.prompt_engineering.gen_templates import prompt_summary
from ai_service.src.utils.states import State
from ai_service.src.llm.openrouter import llm_s

logger = logging.getLogger(__name__)

output = StrOutputParser()
chain = prompt_summary | llm_s | output

MIN_SUMMARY_LENGTH = 50
MAX_SUMMARY_LENGTH = 5000


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10),
    retry=retry_if_exception_type((Exception,)),
    reraise=True
)
def _generate_summary_with_retry(query: str) -> str:
    """
    Генерирует конспект с retry логикой
    """
    response = chain.invoke({"query": query})
    
    if hasattr(response, "content"):
        response = response.content
    response = str(response).strip()
    
    return response


def _validate_summary(summary: str) -> tuple[bool, str]:
    """
    Валидирует сгенерированный конспект
    Возвращает (is_valid, validated_summary)
    """
    if not summary:
        return False, ""
    
    length = len(summary)
    if length < MIN_SUMMARY_LENGTH:
        logger.warning(f"Summary too short: {length} chars (min: {MIN_SUMMARY_LENGTH})")
        return False, summary
    
    if length > MAX_SUMMARY_LENGTH:
        logger.warning(f"Summary too long: {length} chars (max: {MAX_SUMMARY_LENGTH}), truncating")
        return True, summary[:MAX_SUMMARY_LENGTH]
    
    return True, summary


def summary_tool(state: State) -> State:
    """
    Генерирует конспект по теме курса с retry и валидацией
    """
    try:
        query = state.query
        if not query or not query.strip():
            logger.error("Empty query provided")
            state.summary = "Ошибка: пустой запрос"
            return state
        
        response = _generate_summary_with_retry(query)
        
        is_valid, validated_summary = _validate_summary(response)
        if not is_valid:
            logger.error(f"Invalid summary generated for query: {query}")
            state.summary = f"Конспект по теме '{query}'. К сожалению, не удалось сгенерировать полный конспект."
        else:
            state.summary = validated_summary
            logger.info(f"Summary generated successfully for topic: {query} (length: {len(validated_summary)})")
        
    except Exception as e:
        logger.error(f"Error in summary_tool after retries: {e}", exc_info=True)
        state.summary = f"Ошибка при генерации конспекта: {str(e)}"
    
    return state

# if __name__ == "__main__":
#     responce = chain.invoke({"query": "Present Simple"})
#     print(responce)

