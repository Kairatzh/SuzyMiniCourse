# Настройка проекта Fill AI

## Быстрый старт

### 1. Клонирование и подготовка

```bash
git clone <repository-url>
cd SuzyMiniCourse
```

### 2. Создание .env файлов

Скопируйте примеры файлов окружения и заполните их:

```bash
# Backend Service
cp backend_service/env.example backend_service/.env
# Отредактируйте backend_service/.env и заполните значения

# AI Service
cp ai_service/env.example ai_service/.env
# Отредактируйте ai_service/.env и заполните OPENROUTER_API_KEY

# Telegram Bot
cp telegram_bot/env.example telegram_bot/.env
# Отредактируйте telegram_bot/.env и заполните TELEGRAM_BOT_TOKEN
```

### 3. Установка зависимостей

#### Python зависимости

```bash
# Backend Service
cd backend_service
pip install -r requirements.txt
cd ..

# AI Service
cd ai_service
pip install -r requirements.txt
cd ..

# Telegram Bot
cd telegram_bot
pip install -r requirements.txt
cd ..
```

#### Frontend зависимости

```bash
cd frontend_service
npm install
cd ..
```

### 4. Настройка баз данных

#### PostgreSQL

```bash
# Создайте базу данных
createdb fill_ai

# Или используйте Docker
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=fill_ai \
  -p 5432:5432 \
  postgres:15-alpine
```

#### Neo4j

```bash
# Используйте Docker
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/neo4j \
  neo4j:5-community
```

### 5. Запуск через Docker Compose (рекомендуется)

```bash
# Создайте .env файл в корне проекта
cat > .env << EOF
SECRET_KEY=your-secret-key-here
OPENROUTER_API_KEY=your-openrouter-api-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
EOF

# Запустите все сервисы
docker-compose up -d
```

### 6. Ручной запуск сервисов

#### Backend Service
```bash
cd backend_service
python src/main.py
# Доступен на http://localhost:8001
```

#### AI Service
```bash
cd ai_service
python api/main.py
# Доступен на http://localhost:8000
```

#### Telegram Bot
```bash
cd telegram_bot
python src/main.py
```

#### Frontend Service
```bash
cd frontend_service
npm run dev
# Доступен на http://localhost:5173
```

## Переменные окружения

### Backend Service (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fill_ai
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=neo4j
SECRET_KEY=your-secret-key-here
AI_SERVICE_URL=http://localhost:8000
```

### AI Service (.env)

```env
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

### Telegram Bot (.env)

```env
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
BACKEND_URL=http://localhost:8001
AI_SERVICE_URL=http://localhost:8000
```

## Проверка работы

1. **Backend API**: http://localhost:8001/docs
2. **AI Service API**: http://localhost:8000/docs
3. **Frontend**: http://localhost:5173
4. **Telegram Bot**: Отправьте `/start` боту

## Troubleshooting

### Проблемы с подключением к БД

- Проверьте, что PostgreSQL запущен: `pg_isready`
- Проверьте DATABASE_URL в .env файле
- Убедитесь, что база данных создана

### Проблемы с Neo4j

- Проверьте подключение: `cypher-shell -u neo4j -p neo4j`
- Проверьте NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD

### Проблемы с AI Service

- Проверьте OPENROUTER_API_KEY
- Убедитесь, что API ключ валидный

### Проблемы с Telegram Bot

- Проверьте TELEGRAM_BOT_TOKEN
- Убедитесь, что бот создан через @BotFather
- Проверьте, что BACKEND_URL и AI_SERVICE_URL доступны

