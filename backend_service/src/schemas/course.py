"""
Pydantic schemas for Course
"""

from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Optional


class CourseGenerateRequest(BaseModel):
    query: str


class CourseCreate(BaseModel):
    title: str
    topic: str
    summary: str
    tests: List[Dict]
    videos: List[str]
    categories: List[str]


class CourseResponse(BaseModel):
    id: int
    title: str
    topic: str
    summary: str
    user_id: int
    created_at: datetime
    tests: List[Dict] = []
    videos: List[str] = []
    categories: List[str] = []
    status: Optional[str] = "completed"  # completed, processing, failed

    class Config:
        from_attributes = True


class CourseGraphResponse(BaseModel):
    nodes: List[Dict]
    edges: List[Dict]

