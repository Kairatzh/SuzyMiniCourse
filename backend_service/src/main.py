"""
Main FastAPI application for Backend Service
"""
import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from backend_service.src.api.routes import router
from backend_service.src.database.postgres_db import engine, Base
from backend_service.src.database.neo4j_db import close_neo4j_driver, init_neo4j_driver

# Import models to register them with Base
from backend_service.src.models import User, Course, CourseTest, CourseVideo, CourseCategory

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    logger.info("Starting Backend Service...")
    try:
        # Note: For production, use Alembic migrations instead of create_all
        # Base.metadata.create_all(bind=engine) should only be used in development
        # For production, run: alembic upgrade head
        
        # In development, create tables if they don't exist
        # In production, this should be disabled and migrations should be used
        if os.getenv("DEBUG", "false").lower() == "true":
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables created/verified (development mode)")
        else:
            logger.info("Using Alembic migrations for database schema (production mode)")

        # Initialize Neo4j driver
        init_neo4j_driver()
        logger.info("Neo4j driver initialized")

        logger.info("Backend Service started successfully")
    except Exception as e:
        logger.error(f"Error during startup: {e}", exc_info=True)
        raise

    yield

    # Shutdown
    logger.info("Shutting down Backend Service...")
    try:
        close_neo4j_driver()
        logger.info("Neo4j driver closed")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}", exc_info=True)


app = FastAPI(
    title="Fill AI Backend Service",
    description="Backend API for Fill AI course generation platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Handle HTTP exceptions
    """
    logger.warning(f"HTTP {exc.status_code}: {exc.detail} - Path: {request.url.path}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Error",
            "message": exc.detail,
            "status_code": exc.status_code
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle validation errors
    """
    logger.warning(f"Validation error: {exc.errors()} - Path: {request.url.path}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "message": "Invalid request data",
            "details": exc.errors()
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Handle all other exceptions
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred" if os.getenv("DEBUG", "false").lower() != "true" else str(exc)
        }
    )


# Add rate limiting middleware
from backend_service.src.api.rate_limit_middleware import rate_limit_middleware
app.middleware("http")(rate_limit_middleware)

# Include routers
app.include_router(router, prefix="/api/v1")


@app.get("/")
async def root():
    """
    Root endpoint
    """
    return {
        "message": "Fill AI Backend Service",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health/live")
async def liveness():
    """
    Liveness probe - проверка что сервис работает
    """
    return {"status": "alive"}


@app.get("/health/ready")
async def readiness():
    """
    Readiness probe - проверка что сервис готов принимать запросы
    """
    checks = {
        "database": False,
        "neo4j": False,
        "ai_service": False
    }
    
    errors = []
    
    # Check PostgreSQL
    try:
        from backend_service.src.database.postgres_db import engine
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        checks["database"] = True
    except Exception as e:
        errors.append(f"Database: {str(e)}")
        logger.error(f"Database health check failed: {e}")
    
    # Check Neo4j
    try:
        from backend_service.src.database.neo4j_db import get_neo4j_driver
        driver = get_neo4j_driver()
        if driver:
            driver.verify_connectivity()
        checks["neo4j"] = True
    except Exception as e:
        errors.append(f"Neo4j: {str(e)}")
        logger.error(f"Neo4j health check failed: {e}")
    
    # Check AI Service
    try:
        import httpx
        ai_service_url = os.getenv("AI_SERVICE_URL", "http://localhost:8000")
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{ai_service_url}/health")
            if response.status_code == 200:
                checks["ai_service"] = True
    except Exception as e:
        errors.append(f"AI Service: {str(e)}")
        logger.warning(f"AI Service health check failed: {e}")
    
    # Если все критичные сервисы доступны
    if checks["database"] and checks["neo4j"]:
        return {
            "status": "ready",
            "checks": checks
        }
    else:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "not_ready",
                "checks": checks,
                "errors": errors
            }
        )


@app.get("/health")
async def health_check():
    """
    Health check endpoint (backward compatibility)
    """
    return await readiness()


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", "8001"))
    host = os.getenv("BACKEND_HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port, log_level="info")
