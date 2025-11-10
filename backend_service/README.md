# Fill AI Backend Service

Backend сервис для платформы Fill AI - генерации мини-курсов с использованием ИИ.

## Функциональность

- ✅ Регистрация и аутентификация пользователей (JWT)
- ✅ Генерация курсов через AI Service
- ✅ Сохранение курсов в PostgreSQL
- ✅ Управление графом знаний в Neo4j
- ✅ RESTful API для всех операций

## Технологический стек

- **FastAPI** - веб-фреймворк
- **PostgreSQL** - основная база данных
- **Neo4j** - граф база данных для знаний
- **SQLAlchemy** - ORM для PostgreSQL
- **JWT** - аутентификация
- **httpx** - HTTP клиент для AI Service

## Установка

### 1. Установите зависимости

```bash
cd backend_service
pip install -r requirements.txt
```

### 2. Настройте базы данных

#### PostgreSQL

Установите PostgreSQL и создайте базу данных:

```sql
CREATE DATABASE fill_ai;
```

#### Neo4j

Установите Neo4j (Docker вариант):

```bash
docker run \
    --name neo4j-fill-ai \
    -p7474:7474 -p7687:7687 \
    -e NEO4J_AUTH=neo4j/neo4j \
    -d neo4j:latest
```

### 3. Настройте переменные окружения

Создайте файл `.env` в корне проекта:

```env
# PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fill_ai

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=neo4j

# AI Service
AI_SERVICE_URL=http://localhost:8000

# Security
SECRET_KEY=your-secret-key-change-in-production
```

### 4. Инициализируйте базу данных

```bash
python -m backend_service.src.database.init_db
```

### 5. Запустите сервер

```bash
python -m backend_service.src.main
```

Или через uvicorn:

```bash
uvicorn backend_service.src.main:app --host 0.0.0.0 --port 8001 --reload
```

## API Endpoints

### Аутентификация

- `POST /api/v1/users/register` - Регистрация пользователя
- `POST /api/v1/users/login` - Вход (получение токена)
- `GET /api/v1/users/me` - Получить текущего пользователя

### Курсы

- `POST /api/v1/courses/generate` - Сгенерировать курс через AI
- `POST /api/v1/courses` - Создать курс вручную
- `GET /api/v1/courses/{course_id}` - Получить курс
- `GET /api/v1/courses` - Получить все курсы (с пагинацией)
- `GET /api/v1/courses/user/my-courses` - Получить курсы текущего пользователя
- `GET /api/v1/courses/graph/{course_id}` - Получить граф для курса
- `GET /api/v1/courses/graph` - Получить полный граф знаний
- `DELETE /api/v1/courses/{course_id}` - Удалить курс

## Примеры использования

### Регистрация пользователя

```bash
curl -X POST "http://localhost:8001/api/v1/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Вход

```bash
curl -X POST "http://localhost:8001/api/v1/users/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"
```

### Генерация курса

```bash
curl -X POST "http://localhost:8001/api/v1/courses/generate" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Present Simple",
    "user_id": 1
  }'
```

### Получение курса

```bash
curl -X GET "http://localhost:8001/api/v1/courses/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Структура проекта

```
backend_service/
├── src/
│   ├── api/              # API endpoints
│   │   ├── users.py     # User endpoints
│   │   ├── courses.py   # Course endpoints
│   │   └── routes.py    # Router aggregation
│   ├── auth/            # Аутентификация
│   │   └── security.py  # JWT и пароли
│   ├── database/        # База данных
│   │   ├── postgres_db.py  # PostgreSQL
│   │   ├── neo4j_db.py     # Neo4j
│   │   └── init_db.py      # Инициализация
│   ├── models/          # SQLAlchemy модели
│   │   ├── user.py
│   │   └── course.py
│   ├── schemas/        # Pydantic схемы
│   │   ├── user.py
│   │   └── course.py
│   ├── services/       # Бизнес-логика
│   │   ├── ai_service_client.py  # Клиент AI Service
│   │   └── neo4j_service.py      # Neo4j операции
│   └── main.py         # FastAPI приложение
├── config/
│   └── config.yaml     # Конфигурация
├── requirements.txt    # Зависимости
└── README.md          # Документация
```

## Интеграция с AI Service

Backend Service интегрируется с AI Service через HTTP API:

- Endpoint: `http://localhost:8000/api/v1/generate_main/generate`
- Метод: `POST`
- Body: `{"query": "тема курса"}`

AI Service должен возвращать:
```json
{
  "query": "тема",
  "summary": "конспект",
  "tests": [...],
  "videos": [...]
}
```

## Граф знаний (Neo4j)

Система автоматически создает узлы и связи в Neo4j:

- **Course** - узел курса
- **Category** - узел категории
- **User** - узел пользователя
- **BELONGS_TO** - связь курс → категория
- **CREATED** - связь пользователь → курс
- **SIMILAR_TO** - связь курс → курс (для похожих курсов)

## Разработка

### Структура базы данных

**PostgreSQL таблицы:**
- `users` - пользователи
- `courses` - курсы
- `course_tests` - тесты курсов
- `course_videos` - видео курсов
- `course_categories` - категории курсов

### Миграции базы данных

Для миграций используйте Alembic:

```bash
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## Производство

Перед деплоем в продакшен:

1. Измените `SECRET_KEY` на надежный ключ
2. Настройте CORS правильно
3. Используйте переменные окружения для всех конфигов
4. Настройте логирование
5. Добавьте мониторинг и метрики
6. Используйте HTTPS
7. Настройте rate limiting

## Лицензия

См. LICENSE в корне проекта.

