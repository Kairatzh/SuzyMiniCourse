from pydantic import BaseModel
from typing import List, Optional, Dict

class State(BaseModel):
    query: str
    summary: Optional[str] = None
    videos: Optional[List[str]] = None
    tests: Optional[List[Dict]] = None
