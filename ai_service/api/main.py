from fastapi import FastAPI

from ai_service.api.routers.generate_rout import router

app = FastAPI(title="Fill AI")
app.include_router(router=router, prefix="/api/v1")
