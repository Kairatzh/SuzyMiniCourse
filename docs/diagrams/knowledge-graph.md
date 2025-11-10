# Диаграмма работы графа знаний

## Структура графа знаний

```mermaid
graph TB
    subgraph "Nodes (Узлы)"
        U1[User: id=1<br/>username=alice]
        U2[User: id=2<br/>username=bob]
        
        C1[Course: id=1<br/>title=Present Simple<br/>topic=English]
        C2[Course: id=2<br/>title=Past Simple<br/>topic=English]
        C3[Course: id=3<br/>title=Algebra Basics<br/>topic=Math]
        
        CAT1[Category: name=English]
        CAT2[Category: name=Math]
        CAT3[Category: name=Physics]
    end
    
    subgraph "Relationships (Связи)"
        U1 -.->|CREATED| C1
        U1 -.->|CREATED| C2
        U2 -.->|CREATED| C3
        
        C1 -.->|BELONGS_TO| CAT1
        C2 -.->|BELONGS_TO| CAT1
        C3 -.->|BELONGS_TO| CAT2
        
        C1 -.->|SIMILAR_TO| C2
    end
    
    style U1 fill:#e1f5ff
    style U2 fill:#e1f5ff
    style C1 fill:#fff4e1
    style C2 fill:#fff4e1
    style C3 fill:#fff4e1
    style CAT1 fill:#ffe1f5
    style CAT2 fill:#ffe1f5
```

## Создание узла курса в графе

```mermaid
sequenceDiagram
    participant Backend as Backend Service
    participant Neo4jSvc as Neo4j Service
    participant Neo4j as Neo4j Database
    
    Note over Backend,Neo4j: Создание нового курса
    
    Backend->>Neo4jSvc: create_course_node(course_id, title, topic, category)
    Neo4jSvc->>Neo4j: CREATE (c:Course {id, title, topic, category})
    Neo4j-->>Neo4jSvc: Course node created
    
    Backend->>Neo4jSvc: create_category_relationship(course_id, category)
    Neo4jSvc->>Neo4j: MERGE (cat:Category {name})
    Neo4jSvc->>Neo4j: MATCH (c:Course {id})<br/>MERGE (c)-[:BELONGS_TO]->(cat)
    Neo4j-->>Neo4jSvc: Relationship created
    
    Backend->>Neo4jSvc: create_user_course_relationship(user_id, course_id)
    Neo4jSvc->>Neo4j: MERGE (u:User {id})
    Neo4jSvc->>Neo4j: MATCH (c:Course {id})<br/>MERGE (u)-[:CREATED]->(c)
    Neo4j-->>Neo4jSvc: Relationship created
```

## Запрос графа знаний

```mermaid
sequenceDiagram
    participant Client as Клиент
    participant Backend as Backend Service
    participant Neo4jSvc as Neo4j Service
    participant Neo4j as Neo4j Database
    
    Client->>Backend: GET /api/v1/courses/graph/{course_id}
    
    Backend->>Neo4jSvc: get_course_graph(course_id)
    
    Neo4jSvc->>Neo4j: MATCH (c:Course {id})<br/>OPTIONAL MATCH path = (c)-[*1..2]-(connected)<br/>RETURN c, paths
    Neo4j-->>Neo4jSvc: Nodes and relationships
    
    Neo4jSvc->>Neo4j: MATCH (a)-[r]->(b)<br/>RETURN a, type(r), b
    Neo4j-->>Neo4jSvc: All edges
    
    Neo4jSvc->>Neo4jSvc: Форматирование данных<br/>{nodes: [...], edges: [...]}
    Neo4jSvc-->>Backend: Graph data
    
    Backend-->>Client: CourseGraphResponse
```

## Типы узлов и связей

### Узлы (Nodes)

| Тип | Свойства | Описание |
|-----|----------|----------|
| **User** | `id`, `username`, `email` | Пользователь системы |
| **Course** | `id`, `title`, `topic`, `category` | Курс |
| **Category** | `name` | Категория курсов |

### Связи (Relationships)

| Тип | От → К | Свойства | Описание |
|-----|--------|----------|----------|
| **CREATED** | User → Course | - | Пользователь создал курс |
| **BELONGS_TO** | Course → Category | - | Курс принадлежит категории |
| **SIMILAR_TO** | Course → Course | `score` | Похожие курсы |

## Пример Cypher запросов

### Создание узла курса

```cypher
CREATE (c:Course {
    id: $course_id,
    title: $title,
    topic: $topic,
    category: COALESCE($category, 'Uncategorized')
})
```

### Создание связи курс → категория

```cypher
MERGE (cat:Category {name: $category})
WITH cat
MATCH (c:Course {id: $course_id})
MERGE (c)-[:BELONGS_TO]->(cat)
```

### Получение графа для курса

```cypher
MATCH (c:Course {id: $course_id})
OPTIONAL MATCH path = (c)-[*1..2]-(connected)
RETURN c, collect(DISTINCT path) as paths
```

### Поиск похожих курсов

```cypher
MATCH (c1:Course {id: $course_id1})-[r:SIMILAR_TO]-(c2:Course)
WHERE r.score > 0.7
RETURN c2, r.score
ORDER BY r.score DESC
LIMIT 5
```

## Визуализация графа

Граф знаний можно визуализировать в веб-интерфейсе используя библиотеки:

- **D3.js** — для кастомной визуализации
- **vis.js** — готовое решение для графов
- **Cytoscape.js** — мощная библиотека для графов

Формат данных для визуализации:

```json
{
  "nodes": [
    {
      "id": "course_1",
      "label": "Present Simple",
      "type": "Course",
      "data": {
        "id": 1,
        "title": "Present Simple",
        "topic": "English"
      }
    }
  ],
  "edges": [
    {
      "source": "course_1",
      "target": "category_English",
      "type": "BELONGS_TO"
    }
  ]
}
```

