from typing import List, Optional
from pydantic import BaseModel, Field

class Request(BaseModel):
    query: Optional[str] = None

class Responce(BaseModel):
    query: Optional[str] = None
    summary: Optional[str] = None
    tests: Optional[List[str]] = None
    videos: Optional[List[str]] = None

