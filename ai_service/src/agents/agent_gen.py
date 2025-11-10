"""
Главный workflow с координатором и маршрутизацией между агентами
"""
import logging
from langgraph.graph import StateGraph, START, END
from ai_service.src.tools.agent_gen_tools.coordinator import coordinator_tool
from ai_service.src.agents.course_generation_agent import course_generation_agent
from ai_service.src.agents.chat_agent import chat_agent
from ai_service.src.utils.states import State

logger = logging.getLogger(__name__)

workflow = StateGraph(State)

workflow.add_node("Coordinator", coordinator_tool)
workflow.add_node("CourseGeneration", course_generation_agent)
workflow.add_node("Chat", chat_agent)

workflow.add_edge(START, "Coordinator")


def route_after_coordinator(state: State) -> str:
    """
    Функция маршрутизации после координатора
    Определяет, к какому агенту направить запрос
    """
    intent = state.intent
    logger.info(f"Routing to: {intent}")
    
    if intent == "course_generation":
        return "CourseGeneration"
    else:
        return "Chat"


workflow.add_conditional_edges(
    "Coordinator",
    route_after_coordinator,
    {
        "CourseGeneration": "CourseGeneration",
        "Chat": "Chat"
    }
)

workflow.add_edge("CourseGeneration", END)
workflow.add_edge("Chat", END)

agent = workflow.compile()


def generate_c(query: str) -> State:
    """
    Главная функция для генерации курса или чата
    """
    try:
        initial_state = State(query=query)
        result = agent.invoke(initial_state)
        return result
    except Exception as e:
        logger.error(f"Error in generate_c: {e}", exc_info=True)
        # Возвращаем состояние с ошибкой
        error_state = State(query=query)
        error_state.chat_response = f"Произошла ошибка: {str(e)}"
        return error_state

# if __name__ == "__main__":
#     print("Проверка!")
#     query = input("Введите тему: ")
#     course = generate_c(query)
#     print("\n=== РЕЗУЛЬТАТ ===")
#     print(" Summary:", course.summary)
#     print(" Tests:", course.tests)
#     print(" Videos:", course.videos)

