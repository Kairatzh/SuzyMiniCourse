from langchain_together import Together
from langchain_core.output_parsers import StrOutputParser
from ai_service.src.prompt_engineering.templates import prompt_summary
from ai_service.src.utils.states import State

llm = Together(
    model="",
    together_api_key="",
    max_tokens=150,
    temperature=0.3
)
output = StrOutputParser()
chain = prompt_summary | llm | output

def summary_tool(state: State) -> State:
    """Возвращаем краткий конспект"""
    query = state.query
    responce = chain.invoke({"query": query})
    state.summary = responce
    return state