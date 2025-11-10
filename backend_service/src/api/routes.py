"""
Main API routes
"""

from fastapi import APIRouter
from .users import router as users_router
from .courses import router as courses_router

router = APIRouter()

router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(courses_router, prefix="/courses", tags=["courses"])

