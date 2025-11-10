"""
Course API endpoints
"""
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend_service.src.database.postgres_db import get_db
from backend_service.src.models.user import User
from backend_service.src.models.course import Course, CourseTest, CourseVideo, CourseCategory
from backend_service.src.schemas.course import (
    CourseGenerateRequest,
    CourseResponse,
    CourseCreate,
    CourseGraphResponse
)
from backend_service.src.api.users import get_current_user
from backend_service.src.services.ai_service_client import AIServiceClient
from backend_service.src.services.neo4j_service import Neo4jService

logger = logging.getLogger(__name__)

router = APIRouter()
ai_client = AIServiceClient()
neo4j_service = Neo4jService()


def extract_category_from_topic(topic: str) -> str:

    topic_lower = topic.lower()
    
    categories = {
        "english": ["english", "английский", "grammar", "present", "past", "future", "verb"],
        "math": ["math", "математика", "algebra", "geometry", "calculus"],
        "physics": ["physics", "физика", "force", "energy", "motion"],
        "biology": ["biology", "биология", "cell", "organism", "evolution"],
        "chemistry": ["chemistry", "химия", "chemical", "molecule", "reaction"],
        "history": ["history", "история", "historical", "war", "ancient"],
        "programming": ["programming", "программирование", "code", "python", "javascript"],
    }
    
    for category, keywords in categories.items():
        if any(keyword in topic_lower for keyword in keywords):
            return category.capitalize()
    
    return "Uncategorized"


@router.post("/generate", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def generate_course(
    request: CourseGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate a course with improved error handling and timeout management
    For MVP: Synchronous generation with proper error handling
    Future: Can be converted to background tasks
    """
    try:
        logger.info(f"Starting course generation for user {current_user.id}, query: {request.query}")
        
        # Generate course content via AI Service with timeout
        import asyncio
        try:
            ai_response = await asyncio.wait_for(
                ai_client.generate_course(request.query),
                timeout=300.0  # 5 minutes timeout
            )
        except asyncio.TimeoutError:
            logger.error(f"Course generation timeout for query: {request.query}")
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Course generation timed out. Please try again with a simpler query."
            )
        
        # Check intent - if chat, don't create course
        intent = ai_response.get("intent")
        if intent == "chat":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This request was identified as a chat query, not a course generation request"
            )
        
        # Extract data with validation
        summary = ai_response.get("summary", "")
        tests_data = ai_response.get("tests", []) or []
        videos_data = ai_response.get("videos", []) or []
        
        # Validate summary
        if not summary or len(summary.strip()) < 50:
            logger.warning(f"Summary too short or empty for query: {request.query}")
            summary = f"Конспект по теме '{request.query}'. К сожалению, не удалось сгенерировать полный конспект."
        
        # Use topic and group from AI service if available
        topic = ai_response.get("topic") or request.query
        title = topic
        group = ai_response.get("group")

        # Create course
        new_course = Course(
            title=title,
            topic=topic,
            summary=summary,
            user_id=current_user.id,
            status="completed"
        )
        db.add(new_course)
        db.flush() 
        
        # Add tests
        if tests_data and isinstance(tests_data, list):
            # Validate tests data
            valid_tests = [t for t in tests_data if isinstance(t, dict) and t.get("text")]
            if valid_tests:
                course_test = CourseTest(
                    course_id=new_course.id,
                    questions=valid_tests
                )
                db.add(course_test)
        
        # Add videos
        if videos_data:
            if isinstance(videos_data, str):
                videos_data = [videos_data]
            
            # Validate video URLs
            valid_videos = [v for v in videos_data if isinstance(v, str) and v.startswith("http")]
            if valid_videos:
                course_video = CourseVideo(
                    course_id=new_course.id,
                    video_urls=valid_videos
                )
                db.add(course_video)
        
        # Use group from coordinator if available, else fallback
        category = group if group else extract_category_from_topic(topic)
        course_category = CourseCategory(
            course_id=new_course.id,
            category_name=category
        )
        db.add(course_category)
        
        db.commit()
        db.refresh(new_course)

        # Update Neo4j (non-blocking)
        try:
            neo4j_service.create_course_node(
                course_id=new_course.id,
                title=title,
                topic=topic,
                category=category
            )
            
            neo4j_service.create_category_relationship(
                course_id=new_course.id,
                category=category
            )
            
            neo4j_service.create_user_course_relationship(
                user_id=current_user.id,
                course_id=new_course.id
            )
            logger.info(f"Course {new_course.id} added to Neo4j graph")
        except Exception as e:
            logger.error(f"Neo4j error for course {new_course.id}: {e}", exc_info=True)
            # Don't interrupt execution, course is already created in PostgreSQL
        
        return CourseResponse(
            id=new_course.id,
            title=new_course.title,
            topic=new_course.topic,
            summary=new_course.summary,
            user_id=new_course.user_id,
            created_at=new_course.created_at,
            tests=tests_data if tests_data else [],
            videos=videos_data if isinstance(videos_data, list) else [videos_data] if videos_data else [],
            categories=[category],
            status="completed"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error generating course: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate course: {str(e)}"
        )


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    course_data: CourseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_course = Course(
        title=course_data.title,
        topic=course_data.topic,
        summary=course_data.summary,
        user_id=current_user.id
    )
    
    db.add(new_course)
    db.flush()
    
    if course_data.tests:
        course_test = CourseTest(
            course_id=new_course.id,
            questions=course_data.tests
        )
        db.add(course_test)
    
    if course_data.videos:
        course_video = CourseVideo(
            course_id=new_course.id,
            video_urls=course_data.videos
        )
        db.add(course_video)
    
    for category_name in course_data.categories:
        course_category = CourseCategory(
            course_id=new_course.id,
            category_name=category_name
        )
        db.add(course_category)
    
    db.commit()
    db.refresh(new_course)
    
    try:
        category = course_data.categories[0] if course_data.categories else "Uncategorized"
        neo4j_service.create_course_node(
            course_id=new_course.id,
            title=new_course.title,
            topic=new_course.topic,
            category=category
        )
        neo4j_service.create_user_course_relationship(
            user_id=current_user.id,
            course_id=new_course.id
        )
    except Exception as e:
        print(f"Neo4j error: {e}")
    
    return CourseResponse(
        id=new_course.id,
        title=new_course.title,
        topic=new_course.topic,
        summary=new_course.summary,
        user_id=new_course.user_id,
        created_at=new_course.created_at,
        tests=course_data.tests,
        videos=course_data.videos,
        categories=course_data.categories
    )


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: int,
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    course_test = db.query(CourseTest).filter(CourseTest.course_id == course_id).first()
    course_video = db.query(CourseVideo).filter(CourseVideo.course_id == course_id).first()
    course_categories = db.query(CourseCategory).filter(CourseCategory.course_id == course_id).all()
    
    return CourseResponse(
        id=course.id,
        title=course.title,
        topic=course.topic,
        summary=course.summary,
        user_id=course.user_id,
        created_at=course.created_at,
        tests=course_test.questions if course_test else [],
        videos=course_video.video_urls if course_video else [],
        categories=[cat.category_name for cat in course_categories]
    )


@router.get("", response_model=List[CourseResponse])
async def get_courses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    courses = db.query(Course).offset(skip).limit(limit).all()
    
    result = []
    for course in courses:
        course_test = db.query(CourseTest).filter(CourseTest.course_id == course.id).first()
        course_video = db.query(CourseVideo).filter(CourseVideo.course_id == course.id).first()
        course_categories = db.query(CourseCategory).filter(CourseCategory.course_id == course.id).all()
        
        result.append(CourseResponse(
            id=course.id,
            title=course.title,
            topic=course.topic,
            summary=course.summary,
            user_id=course.user_id,
            created_at=course.created_at,
            tests=course_test.questions if course_test else [],
            videos=course_video.video_urls if course_video else [],
            categories=[cat.category_name for cat in course_categories]
        ))
    
    return result


@router.get("/user/my-courses", response_model=List[CourseResponse])
async def get_my_courses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    courses = db.query(Course).filter(Course.user_id == current_user.id).all()
    
    result = []
    for course in courses:
        course_test = db.query(CourseTest).filter(CourseTest.course_id == course.id).first()
        course_video = db.query(CourseVideo).filter(CourseVideo.course_id == course.id).first()
        course_categories = db.query(CourseCategory).filter(CourseCategory.course_id == course.id).all()
        
        result.append(CourseResponse(
            id=course.id,
            title=course.title,
            topic=course.topic,
            summary=course.summary,
            user_id=course.user_id,
            created_at=course.created_at,
            tests=course_test.questions if course_test else [],
            videos=course_video.video_urls if course_video else [],
            categories=[cat.category_name for cat in course_categories]
        ))
    
    return result


@router.get("/graph/{course_id}", response_model=CourseGraphResponse)
async def get_course_graph(course_id: int):
    graph_data = neo4j_service.get_course_graph(course_id=course_id)
    return CourseGraphResponse(**graph_data)


@router.get("/graph", response_model=CourseGraphResponse)
async def get_full_graph():
    graph_data = neo4j_service.get_course_graph()
    return CourseGraphResponse(**graph_data)


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    if course.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this course"
        )
    
    try:
        neo4j_service.delete_course_node(course_id)
    except Exception as e:
        print(f"Neo4j error: {e}")
    
    db.delete(course)
    db.commit()
    
    return None

