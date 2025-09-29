from pydantic import BaseModel

class State(BaseModel):
    query: str
    summary: str
    tests: str
    videos: str

