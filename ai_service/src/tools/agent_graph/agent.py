from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from ai_service.src.llm.openrouter import llm_s
from pydantic import BaseModel
from ai_service.src.utils.states import State
from ai_service.src.prompt_engineering.gen_templates import prompt_graph

output = StrOutputParser()
chain = prompt_graph | llm_s | output

def graph_tool(state: State) -> State:
    query = state.query
    responce = chain.invoke({"query": query})
    state.topic = responce
    return state