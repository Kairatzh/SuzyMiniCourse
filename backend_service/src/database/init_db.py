"""
Script to initialize database tables
Run this once to create all tables
"""

from backend_service.src.database.postgres_db import engine, Base
from backend_service.src.models import User, Course, CourseTest, CourseVideo, CourseCategory

if __name__ == "__main__":
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

