# Диаграмма работы API

## Архитектура API запросов

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web Browser]
        Bot[Telegram Bot]
        Mobile[Mobile App]
    end
    
    subgraph "Backend Service (Port 8001)"
        API[FastAPI Application]
        Auth[JWT Auth]
        Routes[API Routes]
        Services[Services Layer]
    end
    
    subgraph "AI Service (Port 8000)"
        AIAPI[FastAPI Application]
        AgentRouter[Generate Router]
        Agent[Agent Generator]
    end
    
    subgraph "Data Layer"
        Postgres[(PostgreSQL)]
        Neo4j[(Neo4j)]
    end
    
    Web -->|HTTP/HTTPS| API
    Bot -->|HTTP/HTTPS| API
    Mobile -->|HTTP/HTTPS| API
    
    API --> Auth
    Auth --> Routes
    
    Routes -->|GET /courses| Services
    Routes -->|POST /courses/generate| Services
    
    Services -->|Call| AIAPI
    AIAPI --> AgentRouter
    AgentRouter --> Agent
    
    Services -->|Save| Postgres
    Services -->|Create Nodes| Neo4j
    
    Services -->|Query Graph| Neo4j
    Services -->|Query Data| Postgres
```

## Процесс аутентификации

```mermaid
sequenceDiagram
    participant Client as Клиент
    participant API as Backend API
    participant Auth as Auth Service
    participant DB as PostgreSQL

    Client->>API: POST /api/v1/users/register<br/>{username, email, password}
    API->>DB: Проверка существования пользователя
    DB-->>API: User not found
    
    API->>Auth: get_password_hash(password)
    Auth-->>API: hashed_password
    
    API->>DB: Создание пользователя
    DB-->>API: User created
    
    API-->>Client: UserResponse {id, username, email}
    
    Note over Client,DB: Регистрация завершена
    
    Client->>API: POST /api/v1/users/login<br/>{email, password}
    API->>DB: Поиск пользователя по email
    DB-->>API: User found
    
    API->>Auth: verify_password(password, hash)
    Auth-->>API: Password valid
    
    API->>Auth: create_access_token({sub: email})
    Auth-->>API: JWT Token
    
    API-->>Client: Token {access_token, token_type}
    
    Note over Client,DB: Аутентификация завершена
```

## Процесс генерации курса через API

```mermaid
sequenceDiagram
    participant Client as Клиент
    participant Backend as Backend Service
    participant Auth as JWT Auth
    participant AIClient as AI Service Client
    participant AIService as AI Service
    participant Agent as ИИ-Агент
    participant Postgres as PostgreSQL
    participant Neo4j as Neo4j

    Client->>Backend: POST /api/v1/courses/generate<br/>Authorization: Bearer {token}<br/>{query: "Present Simple"}
    
    Backend->>Auth: Проверка токена
    Auth-->>Backend: User authenticated
    
    Backend->>AIClient: generate_course(query)
    AIClient->>AIService: POST /api/v1/generate_main/generate<br/>{query: "Present Simple"}
    
    AIService->>Agent: generate_c(query)
    
    Note over Agent: Генерация курса<br/>(summary, tests, videos)
    
    Agent-->>AIService: State {summary, tests, videos}
    AIService-->>AIClient: CourseGenerateResponse
    
    AIClient-->>Backend: Course data
    
    Backend->>Postgres: INSERT INTO courses
    Postgres-->>Backend: course_id
    
    Backend->>Postgres: INSERT INTO course_tests
    Backend->>Postgres: INSERT INTO course_videos
    Backend->>Postgres: INSERT INTO course_categories
    
    Backend->>Neo4j: CREATE (c:Course {...})
    Backend->>Neo4j: MERGE (c)-[:BELONGS_TO]->(cat:Category)
    Backend->>Neo4j: MERGE (u:User)-[:CREATED]->(c:Course)
    
    Backend-->>Client: CourseResponse {id, title, summary, tests, videos}
```

## Endpoints Backend Service

```mermaid
graph LR
    subgraph "User Endpoints"
        Register[POST /users/register]
        Login[POST /users/login]
        Me[GET /users/me]
    end
    
    subgraph "Course Endpoints"
        Generate[POST /courses/generate]
        Create[POST /courses]
        GetById[GET /courses/{id}]
        GetAll[GET /courses]
        MyCourses[GET /courses/user/my-courses]
        Graph[GET /courses/graph]
        GraphById[GET /courses/graph/{id}]
        Delete[DELETE /courses/{id}]
    end
    
    subgraph "Health"
        Health[GET /health]
        Root[GET /]
    end
```

## Endpoints AI Service

```mermaid
graph LR
    subgraph "Generation"
        Generate[POST /generate_main/generate]
        GenHealth[GET /generate_main/health]
    end
    
    subgraph "Health"
        Health[GET /health]
        Root[GET /]
    end
```

## Схема ответов API

### Успешный ответ

```json
{
  "query": "Present Simple",
  "summary": "Конспект по теме...",
  "tests": [
    {
      "text": "Вопрос?",
      "options": ["A", "B", "C"],
      "correct_answer": "B"
    }
  ],
  "videos": [
    "https://youtube.com/watch?v=...",
    "https://youtube.com/watch?v=..."
  ]
}
```

### Ошибка

```json
{
  "error": "ValidationError",
  "message": "Query cannot be empty",
  "details": {
    "field": "query",
    "value": ""
  }
}
```

