from youtubesearchpython import VideosSearch
from ai_service.src.utils.states import State

def video_tool(state: State) -> State:
    try:
        videos = VideosSearch(state.query, limit=3).result() 
        links = [v['link'] for v in videos.get('result', [])]
        state.videos = links if links else []
    except Exception as e:
        state.videos = [f"Ошибка при поиске видео: {str(e)}"]
    return state