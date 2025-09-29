from langchain_together import Together
from langchain_core.output_parsers import StrOutputParser
from ai_service.src.prompt_engineering.templates import prompt_tests
from ai_service.src.utils.states import State

llm = Together(
    model="",
    together_api_key="",
    max_tokens=150,
    temperature=0.3
)
output = StrOutputParser()
chain = prompt_tests | llm | output

def gentest_tool(state: State) -> State:
    """Возвращаем тест на определенную тему"""
    query = state.query
    responce = chain.invoke({"query": query})
    state.tests = responce
    return state
