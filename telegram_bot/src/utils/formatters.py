"""
Message formatters for Telegram
"""
from typing import List, Dict

# Telegram message limits
MAX_MESSAGE_LENGTH = 4096
SAFE_MESSAGE_LENGTH = 4000  # Leave some margin


def split_message(text: str, max_length: int = SAFE_MESSAGE_LENGTH) -> List[str]:
    """
    Split long messages into chunks that fit Telegram's limit
    """
    if len(text) <= max_length:
        return [text]
    
    chunks = []
    remaining = text
    
    while remaining:
        if len(remaining) <= max_length:
            chunks.append(remaining)
            break
        
        # Try to split at newline
        split_at = remaining.rfind('\n', 0, max_length)
        if split_at == -1:
            # No newline found, split at space
            split_at = remaining.rfind(' ', 0, max_length)
            if split_at == -1:
                # No space found, force split
                split_at = max_length
        
        chunks.append(remaining[:split_at].strip())
        remaining = remaining[split_at:].lstrip()
    
    return chunks


def format_course(course: Dict) -> List[str]:
    """Format course for display, returns list of messages"""
    title = course.get("title", "Без названия")
    topic = course.get("topic", "")
    summary = course.get("summary", "")
    categories = course.get("categories", [])
    
    # First message - header
    header = f"📚 *{title}*\n\n"
    
    if topic:
        header += f"📌 Тема: {topic}\n"
    
    if categories:
        header += f"🏷️ Категории: {', '.join(categories)}\n"
    
    tests = course.get("tests", [])
    if tests:
        header += f"\n🧩 Тестов: {len(tests)}\n"
    
    videos = course.get("videos", [])
    if videos:
        header += f"🎥 Видео: {len(videos)}\n"
    
    messages = [header]
    
    # Summary message
    if summary:
        summary_text = f"📝 *Конспект:*\n\n{summary}"
        summary_chunks = split_message(summary_text)
        messages.extend(summary_chunks)
    
    return messages


def format_course_list(courses: List[Dict]) -> str:
    """Format list of courses"""
    if not courses:
        return "📭 У вас пока нет курсов.\n\nИспользуйте /generate для создания нового курса."
    
    text = f"📚 *Ваши курсы ({len(courses)}):*\n\n"
    for i, course in enumerate(courses[:10], 1):  # Limit to 10
        title = course.get("title", "Без названия")
        course_id = course.get("id", "")
        text += f"{i}. {title} (ID: {course_id})\n"
    
    if len(courses) > 10:
        text += f"\n... и еще {len(courses) - 10} курсов"
    
    return text


def format_tests(tests: List[Dict]) -> List[str]:
    """Format tests for display, returns list of messages"""
    if not tests:
        return ["Тесты отсутствуют"]
    
    messages = []
    current_message = "🧩 *Тестовые вопросы:*\n\n"
    
    for i, test in enumerate(tests[:10], 1):  # Limit to 10
        question = test.get("text", "")
        options = test.get("options", [])
        correct = test.get("correct_answer", "")
        
        question_text = f"*{i}. {question}*\n"
        for j, option in enumerate(options, 1):
            marker = "✅" if option == correct else "  "
            question_text += f"{marker} {j}. {option}\n"
        question_text += "\n"
        
        # Check if adding this question would exceed limit
        if len(current_message) + len(question_text) > SAFE_MESSAGE_LENGTH:
            messages.append(current_message.strip())
            current_message = question_text
        else:
            current_message += question_text
    
    if current_message.strip():
        messages.append(current_message.strip())
    
    if len(tests) > 10:
        messages.append(f"\n... и еще {len(tests) - 10} вопросов")
    
    return messages if messages else ["Тесты отсутствуют"]


def format_videos(videos: List[str]) -> str:
    """Format videos for display"""
    if not videos:
        return "Видео отсутствуют"
    
    text = "🎥 *Видео материалы:*\n\n"
    for i, video_url in enumerate(videos[:3], 1):  # Limit to 3
        text += f"{i}. {video_url}\n"
    
    return text

