"""
Модуль для поиска релевантных YouTube видео по теме
"""
import logging
import time
from youtubesearchpython import VideosSearch
from langchain_core.output_parsers import StrOutputParser
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from ai_service.src.utils.states import State
from ai_service.src.llm.openrouter import llm_t
from ai_service.src.prompt_engineering.gen_templates import prompt_youtube

logger = logging.getLogger(__name__)

MAX_VIDEOS = 3
MIN_VIDEOS = 1
RATE_LIMIT_DELAY = 1 

_last_request_time = 0


def _rate_limit():
    """
    Простой rate limiter для YouTube API
    """
    global _last_request_time
    current_time = time.time()
    time_since_last = current_time - _last_request_time
    
    if time_since_last < RATE_LIMIT_DELAY:
        sleep_time = RATE_LIMIT_DELAY - time_since_last
        time.sleep(sleep_time)
    
    _last_request_time = time.time()


@retry(
    stop=stop_after_attempt(2), 
    wait=wait_exponential(multiplier=2, min=2, max=10),
    retry=retry_if_exception_type((Exception,)),
    reraise=False  
)
def _search_videos(smart_query: str) -> list:
    """
    Ищет видео с retry логикой
    """
    _rate_limit()  
    
    try:
        videos = VideosSearch(smart_query, limit=MAX_VIDEOS).result()
        result = videos.get("result", [])
        
        if not result:
            logger.warning(f"No videos found for query: {smart_query}")
            return []
        
        links = []
        for v in result:
            link = v.get("link")
            if link and isinstance(link, str) and link.startswith("http"):
                links.append(link)
        
        return links[:MAX_VIDEOS]
    
    except Exception as e:
        logger.warning(f"YouTube search error (may be region block): {e}")
        return []


def _validate_video_url(url: str) -> bool:
    """
    Валидирует URL видео
    """
    if not url or not isinstance(url, str):
        return False
    
    valid_domains = ["youtube.com", "youtu.be", "www.youtube.com"]
    return any(domain in url for domain in valid_domains)


def video_tool(state: State) -> State:
    """
    Ищет релевантные YouTube видео по теме курса с обработкой ошибок
    """
    try:
        query = state.query
        if not query or not query.strip():
            logger.error("Empty query provided")
            state.videos = []
            return state
        
        chain = prompt_youtube | llm_t | StrOutputParser()
        response = chain.invoke({"query": query})
        
        if hasattr(response, "content"):
            smart_query = response.content.strip()
        else:
            smart_query = str(response).strip()
        
        if not smart_query:
            smart_query = query 
        
        links = _search_videos(smart_query)
        
        validated_links = [url for url in links if _validate_video_url(url)]
        
        if len(validated_links) < MIN_VIDEOS:
            logger.warning(f"Not enough valid videos found: {len(validated_links)}")
            state.videos = validated_links  
        else:
            state.videos = validated_links
            logger.info(f"Found {len(validated_links)} valid videos for topic: {query}")

    except Exception as e:
        logger.error(f"Error in video_tool: {e}", exc_info=True)
        state.videos = []

    return state


if __name__ == "__main__":
    from ai_service.src.utils.states import State
    state = State(query="Present Simple")
    video_tool(state)
