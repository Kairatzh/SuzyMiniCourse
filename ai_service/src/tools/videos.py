from youtubesearchpython import VideosSearch
from ai_service.src.utils.states import State

def find_video(state: State) -> State:
    try:
        videos = VideosSearch(state.query, limit=3).result() 
        links = [v['link'] for v in videos.get('result', [])]
        state.videos = links if links else None
    except Exception as e:
        state.videos = []
    return state