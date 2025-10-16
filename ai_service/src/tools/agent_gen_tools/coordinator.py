from langchain_core.output_parsers import StrOutputParser

from ai_service.src.prompt_engineering.gen_templates import prompt_coordinator
from ai_service.src.utils.states import State
from ai_service.src.llm.openrouter import llm_s

output = StrOutputParser()
chain = prompt_coordinator | llm_s | output

def coordinator_tool(state: State) -> State:
    query = state.query
    responce = chain.invoke({"query": query})
    state.query = responce
    return state