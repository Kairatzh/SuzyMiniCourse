# Fill AI Telegram Bot

Полнофункциональный Telegram бот для платформы Fill AI.

## Возможности

- Генерация курсов через AI
- Регистрация и авторизация пользователей
- Просмотр созданных курсов
- Чат с AI ассистентом
- Управление профилем

## Установка

1. Установите зависимости:
```bash
pip install -r requirements.txt
```

2. Создайте файл `.env`:
```
TELEGRAM_BOT_TOKEN=your_bot_token
BACKEND_URL=http://localhost:8001
AI_SERVICE_URL=http://localhost:8000
```

3. Запустите бота:
```bash
python src/main.py
```

## Команды бота

- `/start` - Начать работу с ботом
- `/help` - Справка по командам
- `/register` - Зарегистрироваться
- `/login` - Войти в систему
- `/profile` - Просмотр профиля
- `/my_courses` - Мои курсы
- `/generate` - Создать новый курс
- `/chat` - Чат с AI

## Структура проекта

```
telegram_bot/
├── src/
│   ├── main.py           # Точка входа
│   ├── bot.py            # Основной класс бота
│   ├── handlers/         # Обработчики команд
│   ├── services/         # Клиенты для API
│   └── utils/            # Утилиты
├── requirements.txt
└── README.md
```

