# Руководство разработчика

Руководство по разработке и расширению проекта Fill AI.

##  Содержание

1. [Структура проекта](#структура-проекта)
2. [Стиль кода](#стиль-кода)
3. [Добавление новых функций](#добавление-новых-функций)
4. [Работа с базами данных](#работа-с-базами-данных)
5. [Тестирование](#тестирование)
6. [Git workflow](#git-workflow)

---

## Структура проекта

```
FillAI/
├── ai_service/          # AI Service
│   ├── api/             # REST API
│   ├── config/          # Конфигурации
│   └── src/             # Исходный код
│       ├── agents/      # ИИ-агенты
│       ├── llm/         # LLM интеграции
│       ├── tools/       # Инструменты агентов
│       └── utils/       # Утилиты
│
├── backend_service/     # Backend Service
│   ├── src/
│   │   ├── api/         # API endpoints
│   │   ├── auth/        # Аутентификация
│   │   ├── database/    # База данных
│   │   ├── models/      # SQLAlchemy модели
│   │   ├── schemas/     # Pydantic схемы
│   │   └── services/    # Бизнес-логика
│   └── config/          # Конфигурации
│
├── frontend_service/    # Frontend (в разработке)
│
├── docs/                # Документация
│   ├── diagrams/        # Диаграммы
│   ├── installation/    # Инструкции установки
│   └── development/     # Документация для разработчиков
│
└── requirements.txt     # Основные зависимости
```

---

## Стиль кода

### Python

- **PEP 8** — стандарт стиля кода
- **Типы** — используйте type hints
- **Docstrings** — документируйте функции и классы

**Пример:**

```python
def generate_course(query: str) -> CourseResponse:
    """
    Генерирует курс по заданной теме.
    
    Args:
        query: Тема курса
        
    Returns:
        CourseResponse с данными курса
        
    Raises:
        ValueError: Если query пустой
    """
    if not query:
        raise ValueError("Query cannot be empty")
    
    # ... код ...
```

### Форматирование

Используйте **black** для форматирования:

```bash
black --line-length 100 backend_service/src
black --line-length 100 ai_service/src
```

Используйте **flake8** для проверки:

```bash
flake8 backend_service/src --max-line-length=100
flake8 ai_service/src --max-line-length=100
```

---

## Добавление новых функций

### 1. Добавление нового агента

**Шаги:**

1. Создайте файл в `ai_service/src/tools/agent_gen_tools/`
2. Реализуйте функцию агента:

```python
def new_agent_tool(state: State) -> State:
    try:
        # Ваш код
        state.new_field = result
    except Exception as e:
        state.new_field = f"Ошибка: {str(e)}"
    return state
```

3. Добавьте агента в `agent_gen.py`:

```python
from ai_service.src.tools.agent_gen_tools.new_agent import new_agent_tool

def generate_c(query: str) -> State:
    state = State(query=query)
    state = summary_tool(state)
    state = gentest_tool(state)
    state = video_tool(state)
    state = new_agent_tool(state)  # Новый агент
    return state
```

### 2. Добавление нового API endpoint

**Шаги:**

1. Создайте схему в `backend_service/src/schemas/`
2. Добавьте endpoint в `backend_service/src/api/`

**Пример:**

```python
@router.get("/custom", response_model=CustomResponse)
async def custom_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ваш код
    return CustomResponse(...)
```

### 3. Добавление новой модели данных

**Шаги:**

1. Создайте модель в `backend_service/src/models/`
2. Создайте миграцию Alembic
3. Обновите схемы в `backend_service/src/schemas/`

**Пример:**

```python
class NewModel(Base):
    __tablename__ = "new_table"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

---

## Работа с базами данных

### PostgreSQL (SQLAlchemy)

#### Создание миграции

```bash
cd backend_service
alembic revision --autogenerate -m "Add new table"
alembic upgrade head
```

#### Запросы

```python
# Простой запрос
courses = db.query(Course).filter(Course.user_id == user_id).all()

# JOIN
courses = db.query(Course).join(User).filter(User.email == email).all()

# Агрегация
count = db.query(func.count(Course.id)).filter(Course.user_id == user_id).scalar()
```

### Neo4j

#### Создание узла

```python
with get_neo4j_session() as session:
    query = """
    CREATE (n:NewNode {id: $id, name: $name})
    """
    session.run(query, id=1, name="Test")
```

#### Запросы

```python
with get_neo4j_session() as session:
    query = """
    MATCH (c:Course)-[:BELONGS_TO]->(cat:Category)
    WHERE cat.name = $category
    RETURN c
    """
    result = session.run(query, category="English")
    for record in result:
        course = record["c"]
```

---

## Тестирование

### Unit тесты

Создайте файлы `test_*.py`:

```python
import pytest
from backend_service.src.api.courses import generate_course

def test_generate_course():
    # Тест
    pass
```

### Запуск тестов

```bash
pytest backend_service/tests/
pytest ai_service/tests/
```

### Интеграционные тесты

```python
from fastapi.testclient import TestClient
from backend_service.src.main import app

client = TestClient(app)

def test_create_user():
    response = client.post("/api/v1/users/register", json={
        "username": "test",
        "email": "test@test.com",
        "password": "test123"
    })
    assert response.status_code == 201
```

---

## Git workflow

### Ветки

- `main` — основная ветка (продакшен)
- `develop` — ветка разработки
- `feature/feature-name` — новая функция
- `fix/bug-name` — исправление бага

### Коммиты

Используйте конвенции:

- `feat:` — новая функция
- `fix:` — исправление бага
- `docs:` — документация
- `style:` — форматирование
- `refactor:` — рефакторинг
- `test:` — тесты
- `chore:` — обслуживание

**Примеры:**

```bash
git commit -m "feat: add new agent for mindmap generation"
git commit -m "fix: resolve database connection timeout"
git commit -m "docs: update installation guide"
```

### Pull Request

1. Создайте ветку от `develop`
2. Внесите изменения
3. Напишите тесты
4. Обновите документацию
5. Создайте Pull Request

---

## Best Practices

### 1. Обработка ошибок

```python
try:
    result = some_operation()
except SpecificError as e:
    logger.error(f"Error: {e}")
    raise HTTPException(status_code=500, detail=str(e))
```

### 2. Логирование

```python
import logging

logger = logging.getLogger(__name__)

logger.info("Operation started")
logger.warning("Warning message")
logger.error("Error occurred", exc_info=True)
```

### 3. Валидация данных

```python
from pydantic import BaseModel, validator

class Request(BaseModel):
    query: str
    
    @validator('query')
    def validate_query(cls, v):
        if not v or not v.strip():
            raise ValueError('Query cannot be empty')
        return v.strip()
```

### 4. Асинхронность

```python
# Используйте async/await для I/O операций
async def fetch_data():
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()
```

---

## Отладка

### Логи

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Debug режим

```python
if os.getenv("DEBUG") == "true":
    import pdb
    pdb.set_trace()
```

### Проверка запросов

Используйте Swagger UI: `http://localhost:8001/docs`

---

## Полезные ресурсы

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [LangChain Documentation](https://python.langchain.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Neo4j Python Driver](https://neo4j.com/docs/python-manual/current/)

---

## Контакты

Для вопросов создайте Issue в репозитории проекта.

