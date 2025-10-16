"""
    Модуль для генерации конспектов на определенную тему 
"""

from langchain_core.output_parsers import StrOutputParser #Оутпут парсер чтобы выводить структурированные ответы

from ai_service.src.prompt_engineering.gen_templates import prompt_summary #Промпт для LLM
from ai_service.src.utils.states import State #Состояние(State) для LLM
from ai_service.src.llm.openrouter import llm_s #Сам LLMка.можно менять на Together, Openrouter, OpenAI, Claude

output = StrOutputParser()
chain = prompt_summary | llm_s | output

def summary_tool(state: State) -> State:
    try:
        query = state.query
        response = chain.invoke({"query": query})
        state.summary = response
    except Exception as e:
        state.summary = f"Ошибка при генерации конспекта: {str(e)}"
    return state

# if __name__ == "__main__":
#     responce = chain.invoke({"query": "Present Simple"})
#     print(responce)

