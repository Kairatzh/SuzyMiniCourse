from langgraph.graph import StateGraph, START, END
from ai_service.src.tools.agent_gen_tools.summary import summary_tool
from ai_service.src.tools.agent_gen_tools.test import gentest_tool
from ai_service.src.tools.agent_gen_tools.videos import video_tool
from ai_service.src.utils.states import State

workflow = StateGraph(State)

workflow.add_node("Summary", summary_tool)
workflow.add_node("GenerateTests", gentest_tool)
workflow.add_node("SearchVideos", video_tool)

workflow.add_edge(START, "Summary")
workflow.add_edge("Summary", "GenerateTests")
workflow.add_edge("GenerateTests", "SearchVideos")
workflow.add_edge("SearchVideos", END)

agent = workflow.compile()


# def generate_c(query: str) -> State:
#     initial_state = State(query=query)
#     result = agent.invoke(initial_state)

#     return State(
#         query=query,
#         summary=result.summary,
#         tests=result.tests,
#         videos=result.videos
#     )
def generate_c(query: str) -> State:
    state = State(query=query)
    state = summary_tool(state)
    state = gentest_tool(state)
    state = video_tool(state)
    return state

# if __name__ == "__main__":
#     print("Проверка!")
#     query = input("Введите тему: ")
#     course = generate_c(query)
#     print("\n=== РЕЗУЛЬТАТ ===")
#     print(" Summary:", course.summary)
#     print(" Tests:", course.tests)
#     print(" Videos:", course.videos)

