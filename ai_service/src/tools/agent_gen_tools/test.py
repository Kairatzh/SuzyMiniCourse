"""
Модуль для генерации тестов на определенную тему
"""

from typing import List, Dict
from ai_service.src.prompt_engineering.gen_templates import prompt_tests  # Промпт для LLM
from ai_service.src.utils.states import State  # Состояние для LLM
from ai_service.src.llm.openrouter import llm_t  # LLM: Together, Openrouter, OpenAI и др.
from langchain.output_parsers import StructuredOutputParser, ResponseSchema

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

def gentest_tool(state: State) -> State:
    try:
        query = state.query
        raw_response = chain.invoke({"query": query})

        if not isinstance(raw_response, str):
            raw_response = getattr(raw_response, "content", str(raw_response))

        response_obj: dict = parser.parse(raw_response)
        state.tests = response_obj.get("questions", [])
    except Exception as e:
        state.tests = [{"text": f"Ошибка при генерации: {e}", "options": [], "correct_answer": ""}]

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
