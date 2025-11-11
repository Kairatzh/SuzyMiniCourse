"""
Command handlers for Telegram bot
"""
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))

from telegram_bot.src.services.backend_client import BackendClient
from telegram_bot.src.services.ai_service_client import AIServiceClient
from telegram_bot.src.utils.storage import (
    get_token, save_token, clear_token, 
    get_state, save_state, clear_state,
    is_processing, set_processing
)
from telegram_bot.src.utils.formatters import format_course, format_course_list, format_tests, format_videos, split_message

logger = logging.getLogger(__name__)

backend_client = BackendClient()
ai_client = AIServiceClient()


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command"""
    user_id = update.effective_user.id
    username = update.effective_user.username or update.effective_user.first_name
    
    welcome_text = (
        f"👋 Привет, {username}!\n\n"
        "Я Fill AI бот — ваш помощник в создании мини-курсов.\n\n"
        " *Возможности:*\n"
        "• Генерация курсов с помощью AI\n"
        "• Конспекты, тесты и видео материалы\n"
        "• Хранение ваших курсов\n"
        "• Чат с AI ассистентом\n\n"
        "Используйте /help для списка команд."
    )
    
    keyboard = [
        [InlineKeyboardButton(" Создать курс", callback_data="generate")],
        [InlineKeyboardButton(" Мои курсы", callback_data="my_courses")],
        [InlineKeyboardButton(" Чат с AI", callback_data="chat")]
    ]
    
    if not get_token(user_id):
        keyboard.append([InlineKeyboardButton(" Войти", callback_data="login")])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        welcome_text,
        parse_mode="Markdown",
        reply_markup=reply_markup
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /help command"""
    help_text = (
        "📖 *Доступные команды:*\n\n"
        "/start - Начать работу\n"
        "/help - Показать справку\n"
        "/register - Зарегистрироваться\n"
        "/login - Войти в систему\n"
        "/profile - Мой профиль\n"
        "/generate - Создать курс\n"
        "/my_courses - Мои курсы\n"
        "/chat - Чат с AI\n"
        "/logout - Выйти из системы\n\n"
        " *Совет:* Просто отправьте тему курса, и я создам его для вас!"
    )
    
    await update.message.reply_text(help_text, parse_mode="Markdown")


async def register_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /register command"""
    user_id = update.effective_user.id
    
    save_state(user_id, {"action": "register", "step": "username"})
    
    await update.message.reply_text(
        " *Регистрация*\n\n"
        "Введите ваш username:",
        parse_mode="Markdown"
    )


async def login_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /login command"""
    user_id = update.effective_user.id
    
    save_state(user_id, {"action": "login", "step": "email"})
    
    await update.message.reply_text(
        " *Вход в систему*\n\n"
        "Введите ваш email:",
        parse_mode="Markdown"
    )


async def profile_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /profile command"""
    user_id = update.effective_user.id
    token = get_token(user_id)
    
    if not token:
        await update.message.reply_text(
            " Вы не авторизованы.\nИспользуйте /login для входа.",
            parse_mode="Markdown"
        )
        return
    
    profile = await backend_client.get_profile(token)
    
    if profile:
        text = (
            f"👤 *Профиль*\n\n"
            f"Username: {profile.get('username', 'N/A')}\n"
            f"Email: {profile.get('email', 'N/A')}\n"
            f"ID: {profile.get('id', 'N/A')}"
        )
        await update.message.reply_text(text, parse_mode="Markdown")
    else:
        await update.message.reply_text(" Не удалось получить профиль.")


async def generate_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /generate command"""
    user_id = update.effective_user.id
    token = get_token(user_id)
    
    if not token:
        await update.message.reply_text(
            " Вы не авторизованы.\nИспользуйте /login для входа.",
            parse_mode="Markdown"
        )
        return
    
    save_state(user_id, {"action": "generate", "step": "query"})
    
    await update.message.reply_text(
        " *Создание курса*\n\n"
        "Введите тему курса (например: 'Present Simple' или 'Машинное обучение'):",
        parse_mode="Markdown"
    )


async def my_courses_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /my_courses command"""
    user_id = update.effective_user.id
    token = get_token(user_id)
    
    if not token:
        await update.message.reply_text(
            " Вы не авторизованы.\nИспользуйте /login для входа.",
            parse_mode="Markdown"
        )
        return
    
    await update.message.reply_text("⏳ Загружаю ваши курсы...")
    
    courses = await backend_client.get_my_courses(token)
    text = format_course_list(courses)
    
    await update.message.reply_text(text, parse_mode="Markdown")


async def chat_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /chat command"""
    user_id = update.effective_user.id
    
    save_state(user_id, {"action": "chat", "step": "query"})
    
    await update.message.reply_text(
        " *Чат с AI*\n\n"
        "Задайте ваш вопрос:",
        parse_mode="Markdown"
    )


async def logout_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /logout command"""
    user_id = update.effective_user.id
    
    clear_token(user_id)
    clear_state(user_id)
    
    await update.message.reply_text(" Вы вышли из системы.")


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle text messages with concurrency protection"""
    user_id = update.effective_user.id
    text = update.message.text
    
    if is_processing(user_id):
        await update.message.reply_text(" Предыдущий запрос еще обрабатывается. Пожалуйста, подождите...")
        return
    
    state = get_state(user_id)
    
    if state:
        action = state.get("action")
        step = state.get("step")
        
        if action == "register":
            if step == "username":
                save_state(user_id, {"action": "register", "step": "email", "username": text})
                await update.message.reply_text("Введите ваш email:")
            elif step == "email":
                save_state(user_id, {"action": "register", "step": "password", "username": state.get("username"), "email": text})
                await update.message.reply_text("Введите пароль:")
            elif step == "password":
                username = state.get("username")
                email = state.get("email")
                result = await backend_client.register(username, email, text)
                clear_state(user_id)
                
                if result:
                    await update.message.reply_text(" Регистрация успешна! Используйте /login для входа.")
                else:
                    await update.message.reply_text(" Ошибка регистрации. Проверьте данные и попробуйте снова.")
        
        elif action == "login":
            if step == "email":
                save_state(user_id, {"action": "login", "step": "password", "email": text})
                await update.message.reply_text("Введите пароль:")
            elif step == "password":
                email = state.get("email")
                token = await backend_client.login(email, text)
                clear_state(user_id)
                
                if token:
                    save_token(user_id, token)
                    await update.message.reply_text(" Вход выполнен успешно!")
                else:
                    await update.message.reply_text(" Неверный email или пароль.")
        
        elif action == "generate":
            token = get_token(user_id)
            if not token:
                await update.message.reply_text(" Вы не авторизованы.")
                clear_state(user_id)
                return
            
            clear_state(user_id)
            set_processing(user_id, True)
            try:
                await update.message.reply_text(f" Генерирую курс по теме: *{text}*...\nЭто может занять 30-60 секунд.", parse_mode="Markdown")
                
                course = await backend_client.generate_course(token, text)
                
                if course:
                    course_messages = format_course(course)
                    for msg in course_messages:
                        await update.message.reply_text(msg, parse_mode="Markdown")
                    
                    tests = course.get("tests", [])
                    if tests:
                        tests_messages = format_tests(tests)
                        for msg in tests_messages:
                            await update.message.reply_text(msg, parse_mode="Markdown")
                    
                    videos = course.get("videos", [])
                    if videos:
                        videos_text = format_videos(videos)
                        await update.message.reply_text(videos_text, parse_mode="Markdown")
                else:
                    await update.message.reply_text(" Ошибка при генерации курса. Попробуйте позже.")
            finally:
                set_processing(user_id, False)
        
        elif action == "chat":
            clear_state(user_id)
            set_processing(user_id, True)
            try:
                await update.message.reply_text(" Думаю...")
                
                response = await ai_client.generate_or_chat(text)
                
                if response:
                    intent = response.get("intent")
                    if intent == "chat":
                        chat_response = response.get("chat_response", "Извините, не могу ответить.")
                        response_chunks = split_message(chat_response)
                        for chunk in response_chunks:
                            await update.message.reply_text(chunk)
                    else:
                        await update.message.reply_text("Это похоже на запрос на создание курса. Используйте /generate для создания курса.")
                else:
                    await update.message.reply_text(" Ошибка при обработке запроса.")
            finally:
                set_processing(user_id, False)
    else:
        token = get_token(user_id)
        
        if token:
            if is_processing(user_id):
                await update.message.reply_text(" Предыдущий запрос еще обрабатывается. Пожалуйста, подождите...")
                return
            
            set_processing(user_id, True)
            try:
                await update.message.reply_text(f" Генерирую курс по теме: *{text}*...\nЭто может занять 30-60 секунд.", parse_mode="Markdown")
                
                course = await backend_client.generate_course(token, text)
                
                if course:
                    course_messages = format_course(course)
                    for msg in course_messages:
                        await update.message.reply_text(msg, parse_mode="Markdown")
                    
                    tests = course.get("tests", [])
                    if tests:
                        tests_messages = format_tests(tests)
                        for msg in tests_messages:
                            await update.message.reply_text(msg, parse_mode="Markdown")
                    
                    videos = course.get("videos", [])
                    if videos:
                        videos_text = format_videos(videos)
                        await update.message.reply_text(videos_text, parse_mode="Markdown")
                else:
                    await update.message.reply_text(" Ошибка при генерации курса. Попробуйте позже.")
            finally:
                set_processing(user_id, False)
        else:
            # Check if already processing
            if is_processing(user_id):
                await update.message.reply_text(" Предыдущий запрос еще обрабатывается. Пожалуйста, подождите...")
                return
            
            set_processing(user_id, True)
            try:
                await update.message.reply_text(" Думаю...")
                
                response = await ai_client.generate_or_chat(text)
                
                if response:
                    intent = response.get("intent")
                    if intent == "chat":
                        chat_response = response.get("chat_response", "Извините, не могу ответить.")
                        response_chunks = split_message(chat_response)
                        for chunk in response_chunks:
                            await update.message.reply_text(chunk)
                    else:
                        await update.message.reply_text(
                            "Это похоже на запрос на создание курса.\n"
                            "Для создания курсов необходимо авторизоваться.\n"
                            "Используйте /register или /login."
                        )
                else:
                    await update.message.reply_text(" Ошибка при обработке запроса.")
            finally:
                set_processing(user_id, False)

