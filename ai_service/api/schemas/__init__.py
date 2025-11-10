"""
API Schemas for AI Service
"""

from .generate_sch import (
    CourseGenerateRequest,
    CourseGenerateResponse,
    ErrorResponse
)

__all__ = [
    "CourseGenerateRequest",
    "CourseGenerateResponse",
    "ErrorResponse"
]

