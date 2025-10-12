from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

from ai_service.src.agents.agent_gen import generate_c, ToolOutput

app = FastAPI()

class Request(BaseModel):
    query: Optional[str] = None


@app.post("/generate", response_model=ToolOutput)
def generate(request: Request):
    return generate_c(request.query)
