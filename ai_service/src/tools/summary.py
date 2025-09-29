from langchain_together import Together
from langchain_core.output_parsers import StrOutputParser
from ai_service.src.prompt_engineering.templates import prompt_summary
from ai_service.src.utils.states import State
from ai_service.src.llm.together import llm_s

output = StrOutputParser()
chain = prompt_summary | llm_s | output

def summary_tool(state: State) -> State:
    """Возвращаем краткий конспект"""
    query = state.query
    responce = chain.invoke({"query": query})
    state.summary = responce
    return state