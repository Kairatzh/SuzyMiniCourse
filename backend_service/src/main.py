import asyncio
import logging
import os
from telegram import Update
from telegram.ext import (
    Application,
    MessageHandler,
    CommandHandler,
    ContextTypes,
    filters,
)
from telegram.constants import ParseMode, ChatAction
from ai_service.src.workflow import generate_c
from dotenv import load_dotenv
from functools import wraps
from typing import Optional


# ================== Настройка окружения ==================
load_dotenv()
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# ================== Логирование ==================
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)


# ================== Утилиты ==================
def send_typing_action(func):
    """Показывает статус 'печатает...'"""
    @wraps(func)
    async def command_func(update: Update, context: ContextTypes.DEFAULT_TYPE, *args, **kwargs):
        await context.bot.send_chat_action(
            chat_id=update.effective_message.chat_id,
            action=ChatAction.TYPING,
        )
        return await func(update, context, *args, **kwargs)
    return command_func


def split_message(text: str, max_length: int = 4096) -> list[str]:
    """Разделяет длинные сообщения по лимиту Telegram"""
    if len(text) <= max_length:
        return [text]

    parts, current = [], ""
    for line in text.split("\n"):
        if len(current) + len(line) + 1 <= max_length:
            current += line + "\n"
        else:
            parts.append(current.strip())
            current = line + "\n"
    if current:
        parts.append(current.strip())
    return parts


async def send_long_message(update: Update, text: str, parse_mode: Optional[str] = None):
    """Отправляет длинный текст по частям"""
    for i, part in enumerate(split_message(text)):
        await update.message.reply_text(part, parse_mode=parse_mode)
        if i < len(part) - 1:
            await asyncio.sleep(0.3)


# ================== Команды ==================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /start"""
    welcome_message = (
        "👋 <b>Привет! Я Suzy Mini Course бот.</b>\n\n"
        "Напиши тему, и я создам мини-курс с:\n"
        "📘 Конспектом\n🧩 Тестами\n🎬 Видео\n\n"
        "Попробуй, например: <i>«Основы Python»</i>"
    )
    await update.message.reply_text(welcome_message, parse_mode=ParseMode.HTML)


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /help"""
    text = (
        "❓ <b>Как пользоваться:</b>\n"
        "1. Напиши тему курса (например: «Квантовая физика»)\n"
        "2. Подожди 30–60 секунд\n"
        "3. Получи готовый курс 📘\n\n"
        "Команды:\n/start — начать\n/help — справка"
    )
    await update.message.reply_text(text, parse_mode=ParseMode.HTML)


# ================== Основная логика ==================
@send_typing_action
async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка текста пользователя"""
    user_id = update.effective_user.id
    topic = update.message.text.strip()

    if not topic:
        return await update.message.reply_text("⚠️ Введи тему курса!")

    if len(topic) > 500:
        return await update.message.reply_text("⚠️ Слишком длинный запрос (макс. 500 символов).")

    logger.info(f"Пользователь {user_id} запросил тему: {topic}")

    # Отправляем статус
    status_message = await update.message.reply_text(
        f"✨ Генерирую курс по теме: <i>{topic}</i>\n⏳ Подожди 30–60 секунд...",
        parse_mode=ParseMode.HTML,
    )

    try:
        # Запуск генерации в отдельном потоке
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, generate_c, topic)

        await status_message.delete()
        logger.info(f"✅ Курс успешно сгенерирован для {user_id}")

        # === Отправляем результат ===
        summary = result.summary or "Конспект не создан."
        tests = result.tests or []
        videos = result.videos or []

        # Конспект
        await send_long_message(
            update,
            f"📘 <b>Конспект по теме:</b> <i>{topic}</i>\n\n{summary}",
            ParseMode.HTML,
        )

        # Тесты
        if tests:
            text = "🧩 <b>Тесты:</b>\n\n" + "\n\n".join(
                f"{i+1}. {q}" for i, q in enumerate(tests)
            )
            await send_long_message(update, text, ParseMode.HTML)
        else:
            await update.message.reply_text("🧩 Тесты не найдены.", parse_mode=ParseMode.HTML)

        # Видео
        if videos:
            text = "🎬 <b>Видео:</b>\n\n" + "\n".join(f"{i+1}. {v}" for i, v in enumerate(videos))
            await send_long_message(update, text, ParseMode.HTML)
        else:
            await update.message.reply_text("🎬 Видео не найдено.", parse_mode=ParseMode.HTML)

        # Финальное сообщение
        await update.message.reply_text(
            "✅ Курс готов! Напиши новую тему для следующего курса 📚",
            parse_mode=ParseMode.HTML,
        )

    except Exception as e:
        logger.error(f"Ошибка генерации курса: {e}", exc_info=True)
        await status_message.edit_text(
            "❌ Ошибка при генерации курса. Попробуй снова позже.",
            parse_mode=ParseMode.HTML,
        )


# ================== Обработка ошибок ==================
async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    logger.error(f"Ошибка: {context.error}")
    if update and update.effective_message:
        await update.effective_message.reply_text("❌ Произошла ошибка. Попробуй позже.")


# ================== Основная функция ==================
async def main():
    if not BOT_TOKEN:
        logger.error("❌ TELEGRAM_BOT_TOKEN не найден в .env!")
        return

    app = (
        Application.builder()
        .token(BOT_TOKEN)
        .post_init(lambda _: logger.info("✅ Бот готов к работе"))
        .concurrent_updates(True)
        .build()
    )

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    app.add_error_handler(error_handler)

    logger.info("🤖 Запуск Suzy Mini Course бота...")
    await app.run_polling(allowed_updates=Update.ALL_TYPES, drop_pending_updates=True)


if __name__ == "__main__":
    if os.name == "nt":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

    try:
        asyncio.run(main())
    except RuntimeError as e:
        if "event loop is already running" in str(e):
            logger.warning("⚠️ Используется альтернативный запуск...")
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(main())
        else:
            raise
    except KeyboardInterrupt:
        logger.info("🛑 Бот остановлен пользователем")
