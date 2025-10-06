from youtubesearchpython import VideosSearch
from ai_service.src.utils.states import State

def video_tool(state: State) -> State:
    """Находим три видео подходящие по теме"""
    try:
        videos = VideosSearch(state.query, limit=3).result() 
        links = [v['link'] for v in videos.get('result', [])]
        state.videos = links if links else None
    except Exception as e:
        state.videos = []
    return state