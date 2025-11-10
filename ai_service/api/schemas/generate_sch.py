"""
Pydantic schemas for course generation API
"""

from typing import List, Optional, Dict
from pydantic import BaseModel, Field, field_validator


class CourseGenerateRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Topic or query for course generation",
        examples=["Present Simple", "Machine Learning basics"]
    )

    @field_validator("query")
    @classmethod
    def validate_query(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Query cannot be empty")
        return v.strip()


class CourseGenerateResponse(BaseModel):
    query: str = Field(..., description="Original query")
    intent: Optional[str] = Field(None, description="Intent: 'course_generation' or 'chat'")
    topic: Optional[str] = Field(None, description="Course topic (if intent is course_generation)")
    group: Optional[str] = Field(None, description="Thematic group for graph (e.g., 'English', 'Math')")
    summary: Optional[str] = Field(None, description="Course summary/notes")
    tests: Optional[List[Dict]] = Field(
        None,
        description="List of test questions with structure: {text, options, correct_answer}"
    )
    videos: Optional[List[str]] = Field(
        None,
        description="List of YouTube video URLs"
    )
    chat_response: Optional[str] = Field(None, description="Chat response (if intent is chat)")

    class Config:
        json_schema_extra = {
            "example": {
                "query": "Present Simple",
                "intent": "course_generation",
                "topic": "Present Simple",
                "group": "English",
                "summary": "Present Simple is used for...",
                "tests": [
                    {
                        "text": "Which sentence is correct?",
                        "options": ["I am go", "I go", "I goes"],
                        "correct_answer": "I go"
                    }
                ],
                "videos": [
                    "https://www.youtube.com/watch?v=example1",
                    "https://www.youtube.com/watch?v=example2"
                ],
                "chat_response": None
            }
        }


class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[Dict] = Field(None, description="Additional error details")
