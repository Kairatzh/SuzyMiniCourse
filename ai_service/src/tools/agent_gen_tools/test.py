"""
Модуль для генерации тестов на определенную тему
"""
import logging
from typing import List, Dict, Any
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from ai_service.src.prompt_engineering.gen_templates import prompt_tests
from ai_service.src.utils.states import State
from ai_service.src.llm.openrouter import llm_t
from langchain_core.output_parsers import StructuredOutputParser, ResponseSchema

logger = logging.getLogger(__name__)

schema = [
    ResponseSchema(
        name="title",
        description="Название теста"
    ),
    ResponseSchema(
        name="questions",
        description="Список вопросов. Каждый вопрос - объект с 'text', 'options', 'correct_answer'"
    )
]

parser = StructuredOutputParser.from_response_schemas(schema)
format_instructions = parser.get_format_instructions()

chain = prompt_tests | llm_t | parser

MIN_QUESTIONS = 3
MAX_QUESTIONS = 15
MIN_OPTIONS = 2
MAX_OPTIONS = 6


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10),
    retry=retry_if_exception_type((Exception,)),
    reraise=True
)
def _generate_tests_with_retry(query: str) -> dict:
    """
    Генерирует тесты с retry логикой
    """
    raw_response = chain.invoke({"query": query})

    if not isinstance(raw_response, str):
        raw_response = getattr(raw_response, "content", str(raw_response))

    response_obj: dict = parser.parse(raw_response)
    return response_obj


def _validate_question(question: Dict[str, Any]) -> bool:
    """
    Валидирует отдельный вопрос
    """
    if not isinstance(question, dict):
        return False
    
    text = question.get("text", "")
    options = question.get("options", [])
    correct_answer = question.get("correct_answer", "")
    
    if not text or len(text) < 10:
        return False
    
    if not isinstance(options, list) or len(options) < MIN_OPTIONS or len(options) > MAX_OPTIONS:
        return False
    
    if not correct_answer or correct_answer not in options:
        return False
    
    return True


def _validate_tests(tests: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Валидирует список тестовых вопросов
    """
    if not isinstance(tests, list):
        return []
    
    validated_tests = []
    for question in tests:
        if _validate_question(question):
            validated_tests.append(question)
        else:
            logger.warning(f"Invalid question skipped: {question}")
    
    if len(validated_tests) < MIN_QUESTIONS:
        logger.warning(f"Too few valid questions: {len(validated_tests)} (min: {MIN_QUESTIONS})")
        return validated_tests[:MAX_QUESTIONS] if len(validated_tests) > MAX_QUESTIONS else validated_tests
    
    return validated_tests[:MAX_QUESTIONS]


def gentest_tool(state: State) -> State:
    """
    Генерирует тестовые вопросы по теме курса с retry и валидацией
    """
    try:
        query = state.query
        if not query or not query.strip():
            logger.error("Empty query provided")
            state.tests = []
            return state
        
        response_obj = _generate_tests_with_retry(query)
        
        questions = response_obj.get("questions", [])
        
        validated_questions = _validate_tests(questions)
        
        if len(validated_questions) < MIN_QUESTIONS:
            logger.error(f"Not enough valid questions generated: {len(validated_questions)}")
            state.tests = validated_questions  # Возвращаем то, что есть
        else:
            state.tests = validated_questions
            logger.info(f"Generated {len(validated_questions)} valid test questions for topic: {query}")
        
    except Exception as e:
        logger.error(f"Error in gentest_tool after retries: {e}", exc_info=True)
        state.tests = []

    return state



# if __name__ == "__main__":
#     test_state = State(query="Present Simple")
#     result = gentest_tool(test_state)
#     print(f"=== {getattr(result, 'title', 'Без названия')} ===\n")
#     if result.tests:
#         for i, q in enumerate(result.tests, start=1):
#             text = q.get("text", "")
#             options = q.get("options", [])
#             correct = q.get("correct_answer", "")
            
#             print(f"Вопрос {i}: {text}")
#             for idx, option in enumerate(options, start=1):
#                 print(f"  {idx}. {option}")
#             print(f"Правильный ответ: {correct}\n")
#     else:
#         print("Тесты не были сгенерированы.")
