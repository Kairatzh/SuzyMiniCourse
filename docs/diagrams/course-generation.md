# Диаграмма генерации курса

## Общий процесс генерации курса

```mermaid
sequenceDiagram
    participant User as Пользователь
    participant Frontend as Frontend/Bot
    participant Backend as Backend Service
    participant AI as AI Service
    participant Agent as ИИ-Агент
    participant LLM as LLM (OpenRouter)
    participant YouTube as YouTube API
    participant Postgres as PostgreSQL
    participant Neo4j as Neo4j

    User->>Frontend: Запрос на генерацию курса<br/>(тема: "Present Simple")
    Frontend->>Backend: POST /api/v1/courses/generate<br/>{query: "Present Simple"}
    
    Backend->>Backend: Аутентификация пользователя (JWT)
    Backend->>AI: POST /api/v1/generate_main/generate<br/>{query: "Present Simple"}
    
    AI->>Agent: generate_c(query)
    
    Note over Agent: Последовательное выполнение агентов
    
    Agent->>LLM: Генерация конспекта
    LLM-->>Agent: Summary (конспект)
    
    Agent->>LLM: Генерация тестов
    LLM-->>Agent: Tests (тестовые вопросы)
    
    Agent->>LLM: Формирование поискового запроса
    LLM-->>Agent: Search query
    Agent->>YouTube: Поиск видео
    YouTube-->>Agent: Video URLs
    
    Agent-->>AI: State {summary, tests, videos}
    AI-->>Backend: CourseGenerateResponse
    
    Backend->>Postgres: Сохранение курса
    Postgres-->>Backend: Course ID
    
    Backend->>Neo4j: Создание узла курса
    Backend->>Neo4j: Связь курс → категория
    Backend->>Neo4j: Связь пользователь → курс
    
    Backend-->>Frontend: CourseResponse
    Frontend-->>User: Отображение курса
```

## Детальный процесс работы агентов

```mermaid
flowchart TD
    Start([Запрос на генерацию курса]) --> Init[Инициализация State]
    Init --> Summary[Summary Agent]
    
    Summary --> SummaryTool[summary_tool]
    SummaryTool --> SummaryLLM[LLM: Генерация конспекта]
    SummaryLLM --> SummaryResult[Результат: summary]
    
    SummaryResult --> Test[GenerateTests Agent]
    
    Test --> TestTool[gentest_tool]
    TestTool --> TestLLM[LLM: Генерация тестов]
    TestLLM --> TestParse[Парсинг JSON]
    TestParse --> TestResult[Результат: tests]
    
    TestResult --> Video[SearchVideos Agent]
    
    Video --> VideoTool[video_tool]
    VideoTool --> VideoQueryLLM[LLM: Поисковый запрос]
    VideoQueryLLM --> YouTube[YouTube Search API]
    YouTube --> VideoResult[Результат: videos]
    
    VideoResult --> End([Возврат State])
    
    style Summary fill:#e1f5ff
    style Test fill:#fff4e1
    style Video fill:#ffe1f5
```

## Схема данных State

```
State {
    query: str           # Тема курса
    summary: str         # Конспект
    tests: List[Dict]    # Тесты [{text, options, correct_answer}]
    videos: List[str]    # URL видео
}
```

## Обработка ошибок

```mermaid
flowchart TD
    Start([Генерация курса]) --> Try{Попытка генерации}
    
    Try -->|Успех| Success[Успешная генерация]
    Try -->|Ошибка LLM| LLMError[Ошибка LLM]
    Try -->|Ошибка YouTube| YouTubeError[Ошибка YouTube API]
    Try -->|Ошибка сети| NetworkError[Ошибка сети]
    
    LLMError --> LogError[Логирование ошибки]
    YouTubeError --> LogError
    NetworkError --> LogError
    
    LogError --> ErrorResponse[Возврат ошибки клиенту]
    Success --> SuccessResponse[Возврат результата]
    
    style LLMError fill:#ffcccc
    style YouTubeError fill:#ffcccc
    style NetworkError fill:#ffcccc
    style Success fill:#ccffcc
```

