from langgraph.graph import StateGraph, END, START

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

workflow.add_node("Summary", lambda state: {"summary": summary_tool(state["query"])})
workflow.add_node("GenerateTests", lambda state: {"tests": gentest_tool(state["query"])})
workflow.add_node("SearchVideos", lambda state: {"videos": video_tool(state["query"])})

workflow.add_edge(START, "Summary")
workflow.add_edge(START, "GenerateTests")
workflow.add_edge(START, "SearchVideos")

workflow.add_edge("Summary", END)
workflow.add_edge("GenerateTests", END)
workflow.add_edge("SearchVideos", END)

agent = workflow.compile()

def generate_c(query: str) -> ToolOutput:
    result = agent.invoke({"query": query})
    return ToolOutput(
        summary=result.get("summary"),
        tests=result.get("tests", []),
        videos=result.get("videos", [])
    )
