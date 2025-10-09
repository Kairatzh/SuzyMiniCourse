from langgraph.graph import StateGraph, START, END
from ai_service.src.tools.agent_gen_tools.summary import summary_tool
from ai_service.src.tools.agent_gen_tools.test import gentest_tool
from ai_service.src.tools.agent_gen_tools.videos import video_tool
from ai_service.src.utils.states import State
from pydantic import BaseModel
from typing import List


class ToolOutput(BaseModel):
    summary: str
    tests: List[str]
    videos: List[str]

workflow = StateGraph(State)

workflow.add_node("Summary", summary_tool)
workflow.add_node("GenerateTests", gentest_tool)
workflow.add_node("SearchVideos", video_tool)

workflow.add_edge(START, "Summary")
workflow.add_edge("Summary", "GenerateTests")
workflow.add_edge("GenerateTests", "SearchVideos")
workflow.add_edge("SearchVideos", END)

agent = workflow.compile()


def generate_c(query: str) -> ToolOutput:
    initial_state = State(query=query)
    result = agent.invoke(initial_state)

    return ToolOutput(
        summary=getattr(result, "summary", ""),
        tests=getattr(result, "tests", []),
        videos=getattr(result, "videos", [])
    )


if __name__ == "__main__":
    print("Проверка!")
    query = input("Введите тему: ")
    course = generate_c(query)
    print("\n=== РЕЗУЛЬТАТ ===")
    print(" Summary:", course.summary)
    print(" Tests:", course.tests)
    print(" Videos:", course.videos)