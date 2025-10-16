from youtubesearchpython import VideosSearch
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from ai_service.src.utils.states import State
from ai_service.src.llm.openrouter import llm_t
from ai_service.src.prompt_engineering.gen_templates import prompt_youtube


def video_tool(state: State) -> State:
    try:
        chain = prompt_youtube | llm_t | StrOutputParser()
        response = chain.invoke({"query": state.query})
        if hasattr(response, "content"):
            smart_query = response.content.strip()
        else:
            smart_query = str(response).strip()
        videos = VideosSearch(smart_query, limit=3).result()
        links = [v["link"] for v in videos.get("result", [])]

        state.videos = links

    except Exception as e:
        state.videos = [f"Ошибка при поиске видео: {str(e)}"]
        print(" Ошибка:", e)

    return state


# if __name__ == "__main__":
#     from ai_service.src.utils.states import State
#     state = State(query="Present Simple")
#     video_tool(state)
