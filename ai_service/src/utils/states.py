from pydantic import BaseModel
from typing import List, Optional, Dict, Literal

class State(BaseModel):
    """State для передачи данных между агентами"""
    query: str
    intent: Optional[Literal["course_generation", "chat"]] = None
    group: Optional[str] = None  # Тематическая группа для графа (например: "English", "Math")
    topic: Optional[str] = None  # Конкретная тема курса
    summary: Optional[str] = None
    videos: Optional[List[str]] = None
    tests: Optional[List[Dict]] = None
    chat_response: Optional[str] = None  # Ответ для чат-агента
