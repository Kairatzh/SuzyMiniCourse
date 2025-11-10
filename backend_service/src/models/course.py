"""
Course models for PostgreSQL
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend_service.src.database.postgres_db import Base


class Course(Base):
    __tablename__ = "courses"
    __table_args__ = (
        # Составные индексы для частых запросов
        Index('idx_user_created', 'user_id', 'created_at'),
        Index('idx_topic_created', 'topic', 'created_at'),
    )

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    topic = Column(String, nullable=False, index=True)
    summary = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String, default="completed", index=True)  # completed, processing, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    creator = relationship("User", back_populates="courses")
    tests = relationship("CourseTest", back_populates="course", cascade="all, delete-orphan")
    videos = relationship("CourseVideo", back_populates="course", cascade="all, delete-orphan")
    categories = relationship("CourseCategory", back_populates="course", cascade="all, delete-orphan")


class CourseTest(Base):
    __tablename__ = "course_tests"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    questions = Column(JSON, nullable=False)  # JSON array of questions
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="tests")


class CourseVideo(Base):
    __tablename__ = "course_videos"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    video_urls = Column(JSON, nullable=False)  # JSON array of video URLs
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="videos")


class CourseCategory(Base):
    __tablename__ = "course_categories"
    __table_args__ = (
        # Индекс для поиска по категории
        Index('idx_category_name', 'category_name'),
        Index('idx_course_category', 'course_id', 'category_name'),
    )

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False, index=True)
    category_name = Column(String, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="categories")

