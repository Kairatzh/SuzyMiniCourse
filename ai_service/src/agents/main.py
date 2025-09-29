from langgraph.graph import StateGraph, END, START
from ai_service.src.tools.summary import summary_tool
from ai_service.src.tools.test import gentest_tool
from ai_service.src.tools.videos import video_tool
from ai_service.src.utils.states import State

workflow = StateGraph(State)

workflow.add_node("Summary", summary_tool)
workflow.add_node("GenerateTests", gentest_tool)
workflow.add_node("SearchVideos", video_tool)

workflow.add_edge(START ,"Summary")
workflow.add_edge(START ,"GenerateTests")
workflow.add_edge(START ,"SearchVideos")

workflow.add_edge("SearchVideos", END)
workflow.add_edge("SearchVideos", END)
workflow.add_edge("SearchVideos", END)

agent_gen = workflow.compile
