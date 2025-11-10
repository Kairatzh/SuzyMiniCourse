# Инструкции по установке

Полное руководство по установке и настройке всех компонентов проекта Fill AI.

##  Содержание

1. [Требования](#требования)
2. [Установка зависимостей](#установка-зависимостей)
3. [Настройка баз данных](#настройка-баз-данных)
4. [Настройка переменных окружения](#настройка-переменных-окружения)
5. [Запуск сервисов](#запуск-сервисов)
6. [Проверка установки](#проверка-установки)

---

## Требования

### Системные требования

- **Python**: 3.9+
- **PostgreSQL**: 12+
- **Neo4j**: 5.0+
- **Node.js**: 18+ (для фронтенда, опционально)

### Дополнительные требования

- API ключи для LLM (OpenRouter, OpenAI или Together)
- Доступ к интернету (для YouTube API и LLM)

---

## Установка зависимостей

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd SuzyMiniCourse
```

### 2. Установка Python зависимостей

#### Основные зависимости

```bash
pip install -r requirements.txt
```

#### Зависимости AI Service

```bash
cd ai_service
pip install -r ../requirements.txt
```

#### Зависимости Backend Service

```bash
cd ../backend_service
pip install -r requirements.txt
```

### 3. Установка Node.js зависимостей (Frontend)

```bash
cd ../frontend_service
npm install
```

---

## Настройка баз данных

### PostgreSQL

#### 1. Установка PostgreSQL

**Windows:**
- Скачайте установщик с [postgresql.org](https://www.postgresql.org/download/windows/)
- Установите PostgreSQL

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
```

#### 2. Создание базы данных

```bash
# Подключитесь к PostgreSQL
sudo -u postgres psql

# Создайте базу данных
CREATE DATABASE fill_ai;

# Создайте пользователя (опционально)
CREATE USER fill_ai_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE fill_ai TO fill_ai_user;

# Выйдите
\q
```

#### 3. Создание таблиц

```bash
cd backend_service
python -m src.database.init_db
```

### Neo4j

#### 1. Установка Neo4j

**Docker (рекомендуется):**
```bash
docker run \
    --name neo4j-fill-ai \
    -p7474:7474 -p7687:7687 \
    -e NEO4J_AUTH=neo4j/neo4j \
    -d neo4j:latest
```

**Локальная установка:**
- Скачайте Neo4j Desktop с [neo4j.com](https://neo4j.com/download/)
- Установите и запустите

#### 2. Настройка Neo4j

1. Откройте Neo4j Browser: `http://localhost:7474`
2. Войдите с паролем: `neo4j` (при первом входе нужно сменить)
3. Измените пароль

---

## Настройка переменных окружения

### AI Service

Создайте файл `.env` в корне проекта или `ai_service/.env`:

```env
# LLM Configuration
OPENROUTER_API_KEY=your_openrouter_api_key
OPENAI_API_KEY=your_openai_api_key  # Опционально
TOGETHER_API_KEY=your_together_api_key  # Опционально

# Debug
DEBUG=false
```

### Backend Service

Создайте файл `backend_service/.env`:

```env
# PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fill_ai

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=neo4j

# AI Service URL
AI_SERVICE_URL=http://localhost:8000

# JWT Secret Key (ГЕНЕРИРУЙТЕ НАДЕЖНЫЙ КЛЮЧ!)
SECRET_KEY=your-secret-key-minimum-32-characters-long

# Debug
DEBUG=false
```

### Генерация SECRET_KEY

```python
import secrets
print(secrets.token_urlsafe(32))
```

---

## Запуск сервисов

### Вариант 1: Ручной запуск

#### 1. Запуск AI Service

```bash
cd ai_service
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

AI Service будет доступен по адресу: `http://localhost:8000`
Документация API: `http://localhost:8000/docs`

#### 2. Запуск Backend Service

```bash
cd backend_service
python -m src.main
```

Или через uvicorn:

```bash
uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload
```

Backend Service будет доступен по адресу: `http://localhost:8001`
Документация API: `http://localhost:8001/docs`

#### 3. Запуск Telegram Bot (опционально)

```bash
cd backend_service
python -m src.bot
```

Не забудьте настроить `TELEGRAM_BOT_TOKEN` в `.env`.

#### 4. Запуск Frontend (опционально)

```bash
cd frontend_service
npm start
```

Frontend будет доступен по адресу: `http://localhost:3000`

### Вариант 2: Docker Compose (скоро)

Создайте `docker-compose.yml` для одновременного запуска всех сервисов.

---

## Проверка установки

### 1. Проверка AI Service

```bash
curl http://localhost:8000/health
```

Ожидаемый ответ:
```json
{
  "status": "healthy",
  "service": "ai-service"
}
```

### 2. Проверка Backend Service

```bash
curl http://localhost:8001/health
```

Ожидаемый ответ:
```json
{
  "status": "healthy"
}
```

### 3. Тест генерации курса

#### Регистрация пользователя

```bash
curl -X POST "http://localhost:8001/api/v1/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

#### Вход и получение токена

```bash
curl -X POST "http://localhost:8001/api/v1/users/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=testpassword123"
```

Сохраните `access_token` из ответа.

#### Генерация курса

```bash
curl -X POST "http://localhost:8001/api/v1/courses/generate" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Present Simple"
  }'
```

---

## Решение проблем

### Ошибка подключения к PostgreSQL

**Проблема:** `connection refused` или `authentication failed`

**Решение:**
1. Проверьте, запущен ли PostgreSQL: `sudo systemctl status postgresql`
2. Проверьте `DATABASE_URL` в `.env`
3. Убедитесь, что база данных создана
4. Проверьте права доступа пользователя

### Ошибка подключения к Neo4j

**Проблема:** `Unable to connect`

**Решение:**
1. Проверьте, запущен ли Neo4j: `docker ps` или через Neo4j Desktop
2. Проверьте `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD` в `.env`
3. Попробуйте подключиться через Neo4j Browser: `http://localhost:7474`

### Ошибка AI Service

**Проблема:** `AI Service error` или таймаут

**Решение:**
1. Проверьте API ключи LLM в `.env`
2. Проверьте доступность `AI_SERVICE_URL`
3. Проверьте логи AI Service
4. Убедитесь, что есть доступ к интернету

### Ошибки импорта Python

**Проблема:** `ModuleNotFoundError`

**Решение:**
```bash
# Убедитесь, что установлены все зависимости
pip install -r requirements.txt
pip install -r backend_service/requirements.txt

# Проверьте, что используете правильный Python
python --version  # Должно быть 3.9+
```

---

## Следующие шаги

После успешной установки:

1. Прочитайте [Руководство разработчика](../development/README.md)
2. Изучите [API документацию](../diagrams/api-flow.md)
3. Начните разработку!

---

## Полезные команды

### Остановка всех сервисов

```bash
# Найти процессы
ps aux | grep uvicorn
ps aux | grep python

# Остановить
pkill -f uvicorn
pkill -f "python -m src"
```

### Просмотр логов

```bash
# Логи AI Service
tail -f ai_service/logs/app.log  # Если настроено логирование в файл

# Логи Backend Service
tail -f backend_service/logs/app.log  # Если настроено логирование в файл
```

### Очистка базы данных (осторожно!)

```sql
-- PostgreSQL
DROP DATABASE fill_ai;
CREATE DATABASE fill_ai;
```

```cypher
// Neo4j
MATCH (n)
DETACH DELETE n
```

---

## Поддержка

Если возникли проблемы, создайте Issue в репозитории проекта.

