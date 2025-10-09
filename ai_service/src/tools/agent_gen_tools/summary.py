from langchain_together import Together
from langchain_core.output_parsers import StrOutputParser

from ai_service.src.prompt_engineering.templates import prompt_summary
from ai_service.src.utils.states import State
from ai_service.src.llm.openai import llm_s

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

