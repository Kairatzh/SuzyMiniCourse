#  Fill AI — Индекс документации

Быстрая навигация по всей документации проекта.

##  Структура документации

```
docs/
├── README.md                    # Главный путеводитель
├── INDEX.md                     # Этот файл (индекс)
│
├── diagrams/                    # Диаграммы работы
│   ├── course-generation.md    # Процесс генерации курса
│   ├── api-flow.md             # Работа API
│   ├── knowledge-graph.md      # Граф знаний
│   └── agents-flow.md          # Работа агентов
│
├── installation/               # Инструкции установки
│   └── README.md               # Полное руководство по установке
│
└── development/                # Документация для разработчиков
    └── README.md               # Руководство разработчика
```

---

##  Быстрый старт

### Для новых пользователей

1. **[README.md](README.md)** — начните здесь! Обзор проекта и архитектура
2. **[Установка](installation/README.md)** — установите и запустите проект
3. **[Диаграммы](diagrams/)** — изучите, как работает система

### Для разработчиков

1. **[Руководство разработчика](development/README.md)** — стиль кода, best practices
2. **[Диаграммы](diagrams/)** — понимание архитектуры
3. **[API Flow](diagrams/api-flow.md)** — работа с API

---

##  Документация по разделам

###  Основная документация

| Файл | Описание |
|------|----------|
| [README.md](README.md) | Главный путеводитель по проекту, обзор, архитектура |
| [INDEX.md](INDEX.md) | Этот файл — индекс всей документации |

###  Диаграммы

| Файл | Описание |
|------|----------|
| [course-generation.md](diagrams/course-generation.md) | Полный процесс генерации курса от запроса до результата |
| [api-flow.md](diagrams/api-flow.md) | Работа API, endpoints, аутентификация |
| [knowledge-graph.md](diagrams/knowledge-graph.md) | Структура и работа графа знаний в Neo4j |
| [agents-flow.md](diagrams/agents-flow.md) | Детальная работа ИИ-агентов (Summary, Tests, Videos) |

###  Установка и настройка

| Файл | Описание |
|------|----------|
| [installation/README.md](installation/README.md) | Полное руководство по установке всех компонентов |

###  Разработка

| Файл | Описание |
|------|----------|
| [development/README.md](development/README.md) | Руководство для разработчиков, стиль кода, добавление функций |

---

##  Поиск по темам

### Изучаю проект впервые

1. [README.md](README.md) — обзор проекта
2. [course-generation.md](diagrams/course-generation.md) — как генерируются курсы
3. [installation/README.md](installation/README.md) — установка

### Хочу установить проект

1. [installation/README.md](installation/README.md) — пошаговая инструкция
2. [README.md](README.md) — обзор архитектуры

### Хочу понять, как работает API

1. [api-flow.md](diagrams/api-flow.md) — работа API
2. [course-generation.md](diagrams/course-generation.md) — процесс генерации

### Хочу понять, как работают агенты

1. [agents-flow.md](diagrams/agents-flow.md) — детальная работа агентов
2. [course-generation.md](diagrams/course-generation.md) — общий процесс

### Хочу понять граф знаний

1. [knowledge-graph.md](diagrams/knowledge-graph.md) — структура и работа графа
2. [api-flow.md](diagrams/api-flow.md) — API для работы с графом

### Хочу разрабатывать проект

1. [development/README.md](development/README.md) — руководство разработчика
2. [api-flow.md](diagrams/api-flow.md) — понимание API
3. [agents-flow.md](diagrams/agents-flow.md) — понимание агентов

---

##  Типы диаграмм

Все диаграммы созданы в формате **Mermaid**, который поддерживается:
- GitHub (автоматический рендер)
- GitLab
- Многие markdown редакторы
- VS Code (с расширением)

### Просмотр диаграмм

**На GitHub:** Диаграммы автоматически отображаются в `.md` файлах

**Локально:**
- VS Code: Установите расширение "Markdown Preview Mermaid Support"
- Онлайн: [Mermaid Live Editor](https://mermaid.live/)

---

##  Связанные ресурсы

- **Основной README проекта:** `../README.md`
- **AI Service README:** `../ai_service/README.md` (если есть)
- **Backend Service README:** `../backend_service/README.md`

---

##  Советы по использованию

1. **Начните с [README.md](README.md)** — там обзор всего проекта
2. **Используйте диаграммы** для визуального понимания
3. **Следуйте [installation/README.md](installation/README.md)** для установки
4. **Изучите [development/README.md](development/README.md)** перед разработкой

---

**Последнее обновление:** Создано при инициализации проекта  
**Версия документации:** 1.0.0

