"""
Background task for course generation
"""
import logging
from sqlalchemy.orm import Session
from backend_service.src.models.course import Course, CourseTest, CourseVideo, CourseCategory
from backend_service.src.services.ai_service_client import AIServiceClient
from backend_service.src.services.neo4j_service import Neo4jService
from backend_service.src.database.postgres_db import SessionLocal

logger = logging.getLogger(__name__)

ai_client = AIServiceClient()
neo4j_service = Neo4jService()


def extract_category_from_topic(topic: str) -> str:
    """Extract category from topic (fallback)"""
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


async def generate_course_task(course_id: int, query: str, user_id: int):
    """
    Background task for generating course content
    
    This runs asynchronously and updates the course when generation is complete
    """
    db: Session = SessionLocal()
    try:
        # Get course
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            logger.error(f"Course {course_id} not found")
            return
        
        logger.info(f"Starting background generation for course {course_id}")
        
        # Generate course content via AI Service
        ai_response = await ai_client.generate_course(query)
        
        # Check intent
        intent = ai_response.get("intent")
        if intent == "chat":
            logger.warning(f"Course {course_id} generation skipped - chat intent detected")
            return
        
        # Extract data
        summary = ai_response.get("summary", "")
        tests_data = ai_response.get("tests", [])
        videos_data = ai_response.get("videos", [])
        topic = ai_response.get("topic") or query
        group = ai_response.get("group")
        
        # Update course
        course.title = topic
        course.topic = topic
        course.summary = summary
        
        # Add tests
        if tests_data:
            existing_test = db.query(CourseTest).filter(CourseTest.course_id == course_id).first()
            if existing_test:
                existing_test.questions = tests_data
            else:
                course_test = CourseTest(course_id=course_id, questions=tests_data)
                db.add(course_test)
        
        # Add videos
        if videos_data:
            if isinstance(videos_data, str):
                videos_data = [videos_data]
            
            existing_video = db.query(CourseVideo).filter(CourseVideo.course_id == course_id).first()
            if existing_video:
                existing_video.video_urls = videos_data
            else:
                course_video = CourseVideo(course_id=course_id, video_urls=videos_data)
                db.add(course_video)
        
        # Add category
        category = group if group else extract_category_from_topic(topic)
        existing_category = db.query(CourseCategory).filter(
            CourseCategory.course_id == course_id
        ).first()
        if existing_category:
            existing_category.category_name = category
        else:
            course_category = CourseCategory(course_id=course_id, category_name=category)
            db.add(course_category)
        
        db.commit()
        logger.info(f"Course {course_id} updated successfully")
        
        # Update Neo4j
        try:
            neo4j_service.create_course_node(
                course_id=course.id,
                title=course.title,
                topic=course.topic,
                category=category
            )
            neo4j_service.create_category_relationship(course_id=course.id, category=category)
            neo4j_service.create_user_course_relationship(user_id=user_id, course_id=course.id)
            logger.info(f"Course {course_id} added to Neo4j graph")
        except Exception as e:
            logger.error(f"Neo4j error for course {course_id}: {e}", exc_info=True)
    
    except Exception as e:
        logger.error(f"Error in generate_course_task for course {course_id}: {e}", exc_info=True)
        db.rollback()
    finally:
        db.close()

