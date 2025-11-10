#  Быстрый старт Fill AI - Полная инструкция

Этот файл содержит пошаговую инструкцию по запуску всего проекта Fill AI от начала до конца.

---

##  Содержание

1. [Предварительные требования](#предварительные-требования)
2. [Создание баз данных](#создание-баз-данных)
3. [Настройка переменных окружения](#настройка-переменных-окружения)
4. [Установка зависимостей](#установка-зависимостей)
5. [Запуск сервисов](#запуск-сервисов)
6. [Проверка работы](#проверка-работы)
7. [Troubleshooting](#troubleshooting)

---

## Предварительные требования

### Установите необходимое ПО:

1. **Python 3.10+**
   ```bash
   python --version  # Проверьте версию
   ```

2. **PostgreSQL 14+**
   - Windows: https://www.postgresql.org/download/windows/
   - Linux: `sudo apt-get install postgresql`
   - Mac: `brew install postgresql`

3. **Neo4j 5+**
   - Рекомендуется через Docker (см. ниже)
   - Или скачайте с https://neo4j.com/download/

4. **Node.js 18+** (для frontend, опционально)
   ```bash
   node --version
   ```

5. **Docker и Docker Compose** (опционально, но рекомендуется)
   - https://www.docker.com/get-started

---

## Создание баз данных

### 1. PostgreSQL

#### Вариант A: Через командную строку

```bash
# Windows (PowerShell)
# Убедитесь, что PostgreSQL запущен
# Откройте psql
psql -U postgres

# В psql выполните:
CREATE DATABASE fill_ai;
CREATE USER fill_ai_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE fill_ai TO fill_ai_user;
\q
```

#### Вариант B: Через pgAdmin

1. Откройте pgAdmin
2. Подключитесь к серверу PostgreSQL
3. Правой кнопкой на "Databases" → "Create" → "Database"
4. Имя: `fill_ai`
5. Сохраните

#### Вариант C: Через Docker

```bash
docker run -d \
  --name postgres_fill_ai \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=fill_ai \
  -p 5432:5432 \
  postgres:15-alpine
```

**Проверка подключения:**
```bash
psql -h localhost -U postgres -d fill_ai
# Пароль: postgres (или ваш пароль)
```

### 2. Neo4j

#### Вариант A: Через Docker (рекомендуется)

```bash
docker run -d \
  --name neo4j_fill_ai \
  -p 7474:7474 \
  -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/neo4j \
  neo4j:5-community
```

**Проверка:**
- Откройте браузер: http://localhost:7474
- Логин: `neo4j`
- Пароль: `neo4j` (при первом входе попросит сменить)

#### Вариант B: Локальная установка

1. Скачайте Neo4j с https://neo4j.com/download/
2. Распакуйте и запустите:
   ```bash
   cd neo4j/bin
   ./neo4j start  # Linux/Mac
   # или
   neo4j.bat start  # Windows
   ```

**Проверка подключения:**
```bash
cypher-shell -u neo4j -p neo4j
# Выполните: RETURN 1;
```

---

## Настройка переменных окружения

### Шаг 1: Создайте .env файлы

Скопируйте примеры и создайте реальные .env файлы:

```bash
# В корне проекта
cd SuzyMiniCourse

# Backend Service
copy backend_service\env.example backend_service\.env  # Windows
# или
cp backend_service/env.example backend_service/.env    # Linux/Mac

# AI Service
copy ai_service\env.example ai_service\.env  # Windows
# или
cp ai_service/env.example ai_service/.env    # Linux/Mac

# Telegram Bot
copy telegram_bot\env.example telegram_bot\.env  # Windows
# или
cp telegram_bot/env.example telegram_bot/.env    # Linux/Mac
```

### Шаг 2: Заполните Backend Service .env

Откройте `backend_service/.env` и заполните:

```env
# Server
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8001

# PostgreSQL - замените на ваши данные
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fill_ai
# Формат: postgresql://username:password@host:port/database

# Neo4j - замените на ваши данные
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=neo4j  # Ваш пароль Neo4j

# JWT - СГЕНЕРИРУЙТЕ СЛУЧАЙНЫЙ КЛЮЧ!
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# AI Service URL
AI_SERVICE_URL=http://localhost:8000

# Debug
DEBUG=true  # false для production
```

**Важно:** Сгенерируйте SECRET_KEY:
```python
# Python
import secrets
print(secrets.token_urlsafe(32))
```

### Шаг 3: Заполните AI Service .env

Откройте `ai_service/.env` и заполните:

```env
# Server
AI_SERVICE_HOST=0.0.0.0
AI_SERVICE_PORT=8000

# OpenRouter API Key - ПОЛУЧИТЕ НА https://openrouter.ai/
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here

# Debug
DEBUG=true
```

**Как получить OpenRouter API Key:**
1. Зайдите на https://openrouter.ai/
2. Зарегистрируйтесь
3. Перейдите в API Keys
4. Создайте новый ключ
5. Скопируйте и вставьте в .env

### Шаг 4: Заполните Telegram Bot .env

Откройте `telegram_bot/.env` и заполните:

```env
# Telegram Bot Token - ПОЛУЧИТЕ У @BotFather
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# Backend Service URL
BACKEND_URL=http://localhost:8001

# AI Service URL
AI_SERVICE_URL=http://localhost:8000

# Logging
LOG_LEVEL=INFO
```

**Как получить Telegram Bot Token:**
1. Откройте Telegram
2. Найдите @BotFather
3. Отправьте `/newbot`
4. Следуйте инструкциям
5. Скопируйте токен и вставьте в .env

---

## Установка зависимостей

### Создайте виртуальные окружения (рекомендуется)

```bash
# Для каждого сервиса создайте venv
cd backend_service
python -m venv venv
venv\Scripts\activate  # Windows
# или
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
deactivate

cd ../ai_service
python -m venv venv
venv\Scripts\activate  # Windows
# или
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
deactivate

cd ../telegram_bot
python -m venv venv
venv\Scripts\activate  # Windows
# или
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
deactivate
```

### Или установите глобально (не рекомендуется)

```bash
# Backend Service
cd backend_service
pip install -r requirements.txt

# AI Service
cd ../ai_service
pip install -r requirements.txt

# Telegram Bot
cd ../telegram_bot
pip install -r requirements.txt
```

---

## Запуск сервисов

### Порядок запуска:

1. **Базы данных** (PostgreSQL и Neo4j)
2. **AI Service** (порт 8000)
3. **Backend Service** (порт 8001)
4. **Telegram Bot**
5. **Frontend** (опционально, порт 5173)

### 1. Запуск баз данных

#### PostgreSQL
```bash
# Если через Docker
docker start postgres_fill_ai

# Если локально - убедитесь, что служба запущена
# Windows: Services → PostgreSQL
# Linux: sudo systemctl start postgresql
# Mac: brew services start postgresql
```

#### Neo4j
```bash
# Если через Docker
docker start neo4j_fill_ai

# Если локально
cd neo4j/bin
./neo4j start  # Linux/Mac
neo4j.bat start  # Windows
```

**Проверка:**
- PostgreSQL: `psql -h localhost -U postgres -d fill_ai`
- Neo4j: http://localhost:7474

### 2. Запуск AI Service

```bash
cd ai_service

# Активируйте venv (если используете)
venv\Scripts\activate  # Windows
# или
source venv/bin/activate  # Linux/Mac

# Запустите
python api/main.py

# Или через uvicorn напрямую
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

**Проверка:**
- Откройте: http://localhost:8000/docs
- Должна открыться Swagger документация

**Ожидаемый вывод:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 3. Запуск Backend Service

**Откройте НОВЫЙ терминал:**

```bash
cd backend_service

# Активируйте venv (если используете)
venv\Scripts\activate  # Windows
# или
source venv/bin/activate  # Linux/Mac

# Запустите
python src/main.py

# Или через uvicorn
uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload
```

**Проверка:**
- Откройте: http://localhost:8001/docs
- Должна открыться Swagger документация

**Ожидаемый вывод:**
```
INFO:     Starting Backend Service...
INFO:     Database tables created/verified
INFO:     Neo4j driver initialized
INFO:     Backend Service started successfully
INFO:     Uvicorn running on http://0.0.0.0:8001
```

### 4. Запуск Telegram Bot

**Откройте НОВЫЙ терминал:**

```bash
cd telegram_bot

# Активируйте venv (если используете)
venv\Scripts\activate  # Windows
# или
source venv/bin/activate  # Linux/Mac

# Запустите
python src/main.py
```

**Ожидаемый вывод:**
```
INFO:     Starting Telegram Bot...
INFO:     Bot is running. Press Ctrl+C to stop.
```

**Проверка:**
- Откройте Telegram
- Найдите вашего бота
- Отправьте `/start`
- Должен ответить приветствием

### 5. Запуск Frontend (опционально)

**Откройте НОВЫЙ терминал:**

```bash
cd frontend_service

# Установите зависимости (если еще не установлены)
npm install

# Запустите
npm run dev
```

**Проверка:**
- Откройте: http://localhost:5173

---

## Проверка работы

### 1. Проверка AI Service

```bash
# Тест через curl
curl -X POST "http://localhost:8000/api/v1/generate_main/generate" \
  -H "Content-Type: application/json" \
  -d '{"query": "Present Simple"}'
```

Или через браузер: http://localhost:8000/docs → попробуйте endpoint `/generate`

### 2. Проверка Backend Service

```bash
# Регистрация пользователя
curl -X POST "http://localhost:8001/api/v1/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

Или через браузер: http://localhost:8001/docs

### 3. Проверка Telegram Bot

1. Откройте Telegram
2. Найдите вашего бота
3. Отправьте `/start`
4. Попробуйте `/register` или `/generate`

### 4. Проверка баз данных

#### PostgreSQL
```bash
psql -h localhost -U postgres -d fill_ai
# Выполните:
\dt  # Показать таблицы
SELECT * FROM users;  # Проверить пользователей
```

#### Neo4j
1. Откройте http://localhost:7474
2. Войдите (neo4j/ваш_пароль)
3. Выполните запрос:
   ```cypher
   MATCH (n) RETURN n LIMIT 10
   ```

---

## Запуск через Docker Compose (альтернатива)

Если хотите запустить все сразу через Docker:

### 1. Создайте .env в корне проекта

```env
SECRET_KEY=your-secret-key-here-min-32-chars
OPENROUTER_API_KEY=your-openrouter-api-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

### 2. Запустите

```bash
docker-compose up -d
```

### 3. Проверьте логи

```bash
docker-compose logs -f
```

### 4. Остановите

```bash
docker-compose down
```

---

## Troubleshooting

### Проблема: "Connection refused" к PostgreSQL

**Решение:**
1. Проверьте, что PostgreSQL запущен:
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Проверьте DATABASE_URL в .env
3. Проверьте, что порт 5432 не занят:
   ```bash
   netstat -an | findstr 5432  # Windows
   netstat -an | grep 5432     # Linux/Mac
   ```

### Проблема: "Connection refused" к Neo4j

**Решение:**
1. Проверьте, что Neo4j запущен:
   ```bash
   docker ps | grep neo4j
   ```

2. Проверьте NEO4J_URI в .env
3. Попробуйте подключиться через браузер: http://localhost:7474

### Проблема: "ModuleNotFoundError"

**Решение:**
1. Убедитесь, что активировано виртуальное окружение
2. Переустановите зависимости:
   ```bash
   pip install -r requirements.txt
   ```

### Проблема: "Invalid API Key" в AI Service

**Решение:**
1. Проверьте OPENROUTER_API_KEY в ai_service/.env
2. Убедитесь, что ключ валидный на https://openrouter.ai/
3. Проверьте баланс на OpenRouter

### Проблема: Telegram Bot не отвечает

**Решение:**
1. Проверьте TELEGRAM_BOT_TOKEN в telegram_bot/.env
2. Убедитесь, что бот создан через @BotFather
3. Проверьте логи бота на наличие ошибок
4. Убедитесь, что BACKEND_URL и AI_SERVICE_URL доступны

### Проблема: "Failed to connect to database"

**Решение:**
1. Проверьте, что PostgreSQL запущен
2. Проверьте DATABASE_URL формат:
   ```
   postgresql://username:password@host:port/database
   ```
3. Попробуйте подключиться вручную:
   ```bash
   psql -h localhost -U postgres -d fill_ai
   ```

### Проблема: Порт уже занят

**Решение:**
1. Найдите процесс, занимающий порт:
   ```bash
   # Windows
   netstat -ano | findstr :8000
   
   # Linux/Mac
   lsof -i :8000
   ```

2. Остановите процесс или измените порт в .env

---

## Полезные команды

### Проверка статуса сервисов

```bash
# Проверить, какие порты заняты
netstat -an | findstr "8000 8001 5432 7687"  # Windows
netstat -an | grep -E "8000|8001|5432|7687"  # Linux/Mac

# Проверить Docker контейнеры
docker ps

# Проверить логи
docker-compose logs -f [service_name]
```

### Очистка и перезапуск

```bash
# Остановить все сервисы
# Нажмите Ctrl+C в каждом терминале

# Очистить базу данных (ОСТОРОЖНО!)
psql -h localhost -U postgres -d fill_ai -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Перезапустить через Docker
docker-compose restart
```

---

## Следующие шаги

После успешного запуска:

1. **Создайте первого пользователя** через API или Telegram бота
2. **Сгенерируйте первый курс** через `/generate` в боте
3. **Изучите API документацию** на http://localhost:8001/docs
4. **Настройте frontend** (если используете)
5. **Настройте production окружение** (измените DEBUG=false, SECRET_KEY и т.д.)

---

## Контакты и поддержка

- Создайте issue в репозитории
- Проверьте документацию в папке `docs/`
- Изучите логи сервисов для диагностики проблем

---

**Удачи в использовании Fill AI! **

