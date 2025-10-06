from langchain_together import Together
from langchain_core.output_parsers import StrOutputParser

from ai_service.src.prompt_engineering.templates import prompt_tests
from ai_service.src.utils.states import State
from ai_service.src.llm.openai import llm_t


output = StrOutputParser()
chain = prompt_tests | llm_t | output

def gentest_tool(state: State) -> State:
    """Возвращаем тест на определенную тему"""
    query = state.query
    responce = chain.invoke({"query": query})
    state.tests = responce
    return state
