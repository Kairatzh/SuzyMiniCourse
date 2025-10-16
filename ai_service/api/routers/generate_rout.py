from fastapi import APIRouter

from ai_service.src.agents.agent_gen import generate_c
from ai_service.api.schemas.generate_sch import Request, Responce

router = APIRouter(prefix="/generate_main")

@router.post("/generate", response_model=Responce)
def generate(request: Request):
    return generate_c(request.query)