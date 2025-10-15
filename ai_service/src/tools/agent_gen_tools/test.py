"""
    Модуль для генерации тестов на определенную тему
"""

from ai_service.src.prompt_engineering.templates import prompt_tests #Промпт для LLM
from ai_service.src.utils.states import State #Состояние(State) для LLM
from ai_service.src.llm.openrouter import llm_t #Сам LLMка.можно менять на Together, Openrouter, OpenAI, Claude
from langchain_core.output_parsers import StrOutputParser #Оутпут парсер чтобы выводить структурированные ответы

output = StrOutputParser()
chain = prompt_tests | llm_t | output


def gentest_tool(state: State) -> State:
    try:
        query = state.query
        response = chain.invoke({"query": query})

        if not isinstance(response, str):
            response = getattr(response, "content", str(response))

        tests = [test.strip() for test in response.split("\n\n") if test.strip()]
        state.tests = tests
    except Exception as e:
        state.tests = [f"Ошибка при генерации тестов: {str(e)}"]

    return state


# if __name__ == "__main__":
#     test_state = State(query="Present Simple")
#     result = gentest_tool(test_state)
#     print("\n=== Сгенерированные тесты ===")
#     for t in result.tests:
#         print(t)
