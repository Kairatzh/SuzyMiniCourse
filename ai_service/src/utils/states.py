from pydantic import BaseModel
from typing import List, Optional

class State(BaseModel):
    query: str
    summary: Optional[str] = None
    tests: Optional[List[str]] = None
    videos: Optional[List[str]] = None

