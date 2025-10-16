from langchain_core.output_parsers import StrOutputParser 

from ai_service.src.prompt_engineering.simple_templates import prompt_simple
from ai_service.src.utils.states import State 
from ai_service.src.llm.openrouter import llm_s

output = StrOutputParser()
chain = prompt_simple | llm_s | output

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
