# Диаграмма работы агентов

## Архитектура агентов

```mermaid
graph TB
    subgraph "Agent Generator"
        AG[agent_gen.py<br/>generate_c]
    end
    
    subgraph "Agents"
        Summary[Summary Agent<br/>summary_tool]
        Test[GenerateTests Agent<br/>gentest_tool]
        Video[SearchVideos Agent<br/>video_tool]
    end
    
    subgraph "LLM Services"
        LLM1[LLM Service<br/>OpenRouter]
        LLM2[LLM Service<br/>OpenAI/Together]
    end
    
    subgraph "External APIs"
        YouTube[YouTube Search API]
    end
    
    subgraph "Prompt Engineering"
        PromptS[prompt_summary]
        PromptT[prompt_tests]
        PromptY[prompt_youtube]
    end
    
    AG --> Summary
    Summary --> PromptS
    PromptS --> LLM1
    LLM1 --> Summary
    
    Summary --> Test
    Test --> PromptT
    PromptT --> LLM2
    LLM2 --> Test
    
    Test --> Video
    Video --> PromptY
    PromptY --> LLM1
    LLM1 --> Video
    Video --> YouTube
    
    Summary -.-> AG
    Test -.-> AG
    Video -.-> AG
```

## Последовательность выполнения агентов

```mermaid
stateDiagram-v2
    [*] --> Initialize: query = "Present Simple"
    
    Initialize --> SummaryAgent: Create State(query)
    
    SummaryAgent --> SummaryLLM: Invoke chain
    SummaryLLM --> SummaryResult: Get summary
    SummaryResult --> StateSummary: Update state.summary
    
    StateSummary --> TestAgent: state = summary_tool(state)
    
    TestAgent --> TestLLM: Invoke chain with parser
    TestLLM --> TestParse: Parse JSON
    TestParse --> TestResult: Get tests array
    TestResult --> StateTests: Update state.tests
    
    StateTests --> VideoAgent: state = gentest_tool(state)
    
    VideoAgent --> VideoLLM: Get search query
    VideoLLM --> VideoQuery: Extract query
    VideoQuery --> YouTubeAPI: Search videos
    YouTubeAPI --> VideoResult: Get video URLs
    VideoResult --> StateVideos: Update state.videos
    
    StateVideos --> [*]: Return state
```

## Детальная работа Summary Agent

```mermaid
flowchart TD
    Start([summary_tool called]) --> Input[Input: State with query]
    Input --> Chain[prompt_summary | llm_s | output]
    
    Chain --> Prompt[Prompt Template:<br/>'Создай конспект по теме {query}']
    Prompt --> LLM[LLM: OpenRouter]
    
    LLM --> Response[Response: Конспект текста]
    Response --> Update[Update State.summary]
    Update --> Return[Return State]
    
    Error{Exception?}
    Chain -.->|Error| Error
    Error --> ErrorMsg[Set state.summary = 'Ошибка: ...']
    ErrorMsg --> Return
    
    Return --> End([End])
    
    style LLM fill:#e1f5ff
    style Error fill:#ffcccc
```

## Детальная работа Test Agent

```mermaid
flowchart TD
    Start([gentest_tool called]) --> Input[Input: State with query]
    Input --> Setup[Setup: StructuredOutputParser<br/>ResponseSchema: title, questions]
    
    Setup --> Chain[prompt_tests | llm_t | parser]
    
    Chain --> Prompt[Prompt Template:<br/>'Создай тест из 5-10 вопросов<br/>в формате JSON']
    Prompt --> LLM[LLM: OpenRouter]
    
    LLM --> RawResponse[Raw JSON Response]
    RawResponse --> Parse[Parse JSON string]
    
    Parse --> Validate{Valid JSON?}
    Validate -->|Yes| Extract[Extract questions array]
    Validate -->|No| Error[Set error question]
    
    Extract --> Update[Update State.tests = questions]
    Error --> Update
    
    Update --> Return[Return State]
    Return --> End([End])
    
    style LLM fill:#e1f5ff
    style Parse fill:#fff4e1
    style Error fill:#ffcccc
```

## Детальная работа Video Agent

```mermaid
flowchart TD
    Start([video_tool called]) --> Input[Input: State with query]
    Input --> Chain1[prompt_youtube | llm_t | StrOutputParser]
    
    Chain1 --> Prompt[Prompt Template:<br/>'Создай поисковый запрос<br/>для YouTube по теме {query}']
    Prompt --> LLM[LLM: OpenRouter]
    
    LLM --> SearchQuery[Smart Search Query]
    SearchQuery --> Clean[Clean and strip query]
    
    Clean --> YouTubeAPI[VideosSearch<br/>smart_query, limit=3]
    
    YouTubeAPI --> Response[Response: videos result]
    Response --> Extract[Extract links:<br/>v['link'] for v in result]
    
    Extract --> Update[Update State.videos = links]
    
    Error{Exception?}
    YouTubeAPI -.->|Error| Error
    Error --> ErrorMsg[Set state.videos = ['Ошибка: ...']]
    ErrorMsg --> Update
    
    Update --> Return[Return State]
    Return --> End([End])
    
    style LLM fill:#e1f5ff
    style YouTubeAPI fill:#ffe1f5
    style Error fill:#ffcccc
```

## Структура State во время выполнения

```mermaid
graph LR
    subgraph "State Initial"
        S1[State<br/>query: 'Present Simple'<br/>summary: None<br/>tests: None<br/>videos: None]
    end
    
    subgraph "After Summary"
        S2[State<br/>query: 'Present Simple'<br/>summary: '...'<br/>tests: None<br/>videos: None]
    end
    
    subgraph "After Tests"
        S3[State<br/>query: 'Present Simple'<br/>summary: '...'<br/>tests: [{...}]<br/>videos: None]
    end
    
    subgraph "After Videos"
        S4[State<br/>query: 'Present Simple'<br/>summary: '...'<br/>tests: [{...}]<br/>videos: ['url1', 'url2']]
    end
    
    S1 -->|summary_tool| S2
    S2 -->|gentest_tool| S3
    S3 -->|video_tool| S4
```

## Обработка ошибок в агентах

```mermaid
flowchart TD
    Agent[Agent Execution] --> Try{Try block}
    
    Try -->|Success| Success[Update state field]
    Try -->|Exception| Catch[Catch Exception]
    
    Catch --> ErrorMsg[Set error message<br/>in state field]
    ErrorMsg --> Log[Log error]
    Log --> Continue[Continue to next agent]
    
    Success --> Continue
    Continue --> NextAgent[Next Agent]
    
    NextAgent --> Final{All agents done?}
    Final -->|No| Agent
    Final -->|Yes| Return[Return State<br/>even with errors]
    
    style Catch fill:#ffcccc
    style ErrorMsg fill:#ffe6e6
    style Success fill:#ccffcc
```

