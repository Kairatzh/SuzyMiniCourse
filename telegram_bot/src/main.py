"""
Main entry point for Telegram Bot
"""
import logging
import os
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ContextTypes
from dotenv import load_dotenv

from telegram_bot.src.handlers.commands import (
    start_command,
    help_command,
    register_command,
    login_command,
    profile_command,
    generate_command,
    my_courses_command,
    chat_command,
    logout_command,
    handle_message
)

load_dotenv()

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

if not TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN environment variable is not set")


async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle callback queries from inline keyboards"""
    query = update.callback_query
    
    if not query or not query.message:
        return
    
    await query.answer()
    
    data = query.data
    user_id = update.effective_user.id
    
    if data == "generate":
        from telegram_bot.src.utils.storage import get_token
        token = get_token(user_id)
        if not token:
            await query.message.reply_text(" Вы не авторизованы.\nИспользуйте /login для входа.")
            return
        from telegram_bot.src.utils.storage import save_state
        save_state(user_id, {"action": "generate", "step": "query"})
        await query.message.reply_text(" *Создание курса*\n\nВведите тему курса:", parse_mode="Markdown")
    elif data == "my_courses":
        from telegram_bot.src.utils.storage import get_token
        token = get_token(user_id)
        if not token:
            await query.message.reply_text(" Вы не авторизованы.\nИспользуйте /login для входа.")
            return
        await query.message.reply_text(" Загружаю ваши курсы...")
        from telegram_bot.src.services.backend_client import BackendClient
        backend = BackendClient()
        courses = await backend.get_my_courses(token)
        from telegram_bot.src.utils.formatters import format_course_list
        text = format_course_list(courses)
        await query.message.reply_text(text, parse_mode="Markdown")
    elif data == "chat":
        from telegram_bot.src.utils.storage import save_state
        save_state(user_id, {"action": "chat", "step": "query"})
        await query.message.reply_text(" *Чат с AI*\n\nЗадайте ваш вопрос:", parse_mode="Markdown")
    elif data == "login":
        from telegram_bot.src.utils.storage import save_state
        save_state(user_id, {"action": "login", "step": "email"})
        await query.message.reply_text(" *Вход в систему*\n\nВведите ваш email:", parse_mode="Markdown")


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle errors"""
    logger.error(f"Update {update} caused error {context.error}", exc_info=context.error)
    
    if update and update.effective_message:
        try:
            await update.effective_message.reply_text(
                " Произошла ошибка. Попробуйте позже или используйте /help."
            )
        except Exception as e:
            logger.error(f"Error sending error message: {e}")


def main():
    """Main function to run the bot"""
    logger.info("Starting Telegram Bot...")
    
    application = Application.builder().token(TOKEN).build()
    
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("register", register_command))
    application.add_handler(CommandHandler("login", login_command))
    application.add_handler(CommandHandler("profile", profile_command))
    application.add_handler(CommandHandler("generate", generate_command))
    application.add_handler(CommandHandler("my_courses", my_courses_command))
    application.add_handler(CommandHandler("chat", chat_command))
    application.add_handler(CommandHandler("logout", logout_command))
    
    application.add_handler(CallbackQueryHandler(callback_handler))
    
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    application.add_error_handler(error_handler)
    
    logger.info("Bot is running. Press Ctrl+C to stop.")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()

