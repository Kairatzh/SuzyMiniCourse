import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from ai_service.src.agents.agent_gen import generate_c
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Привет! Я Fill AI.\n"
        "Отправь тему (например: *Machine Learning basics*), и я создам мини-курс.",
        parse_mode="Markdown"
    )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.message.text
    await update.message.reply_text(f"⏳ Генерирую курс по теме: *{query}*...", parse_mode="Markdown")

    try:
        result = generate_c(query)

        summary_text = f"📘 *Конспект:*\n{result.summary}"
        tests_text = f"🧩 *Тесты:*\n{result.tests}"
        videos_text = f"🎥 *Видео:*\n{result.videos}"

        await update.message.reply_text(summary_text, parse_mode="Markdown")
        await update.message.reply_text(tests_text, parse_mode="Markdown")
        await update.message.reply_text(videos_text, parse_mode="Markdown")

    except Exception as e:
        logger.error(f"Ошибка при генерации курса: {e}")
        await update.message.reply_text("⚠️ Произошла ошибка при генерации курса. Попробуй позже.")

def main():
    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("🤖 Бот запущен. Нажми Ctrl+C для остановки.")
    app.run_polling()

if __name__ == "__main__":
    main()
