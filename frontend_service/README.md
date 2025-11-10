# Frontend Service - FILL.AI

Современный веб-интерфейс для платформы AI-генерации курсов FILL.AI.

**Минималистичный dark дизайн** | **2D граф знаний** | **Современные технологии**

## Структура проекта

```
frontend_service/
├── src/
│   ├── components/          # Переиспользуемые UI компоненты
│   │   ├── CourseCard.js    # Карточка курса
│   │   ├── GraphView.js     # 3D визуализация графа знаний
│   │   ├── Header.js        # Шапка приложения
│   │   ├── SearchBar.js     # Панель поиска и генерации
│   │   └── Sidebar.js       # Боковая панель навигации
│   │
│   ├── pages/               # Страницы приложения
│   │   ├── DashboardPage.js # Главная панель с курсами
│   │   ├── LandingPage.js   # Лендинг для новых пользователей
│   │   ├── LoginPage.js     # Страница входа
│   │   └── RegisterPage.js  # Страница регистрации
│   │
│   ├── services/            # Бизнес-логика и API
│   │   ├── api.service.js   # Клиент для backend API
│   │   └── auth.service.js  # Управление авторизацией
│   │
│   ├── config/              # Конфигурация
│   │   └── api.config.js    # Endpoints и настройки API
│   │
│   ├── styles/              # Стили
│   │   └── main.css         # Основные стили
│   │
│   ├── index.html           # Точка входа HTML
│   └── app.js               # Главный контроллер приложения
│
└── README.md                # Документация

```

## Особенности

###  Современный дизайн
- Минималистичный dark-тематичный интерфейс
- Адаптивный дизайн для всех устройств
- Плавные анимации и переходы
- 2D визуализация графа знаний с vis-network

###  Архитектура
- Модульная структура с компонентами
- Разделение логики и представления
- State management для авторизации
- Динамическая загрузка модулей (ES6 modules)

###  Функционал
- **Лендинг** - знакомство с платформой для новых пользователей
- **Авторизация** - регистрация и вход в систему
- **Dashboard** - панель управления курсами
- **Генерация курсов** - создание AI-курсов по запросу
- **Визуализация** - интерактивный граф знаний
- **Управление курсами** - просмотр, редактирование, удаление

## Технологии

- **HTML5** - семантическая разметка
- **CSS3** - профессиональные стили с CSS Variables
- **JavaScript ES6+** - модульная архитектура
- **vis-network** - 2D граф знаний (вместо Three.js 3D)
- **Fetch API** - взаимодействие с backend

## Быстрый старт

###  Демо-режим (без backend)

**Быстрее всего!** Запустите фронтенд с мокированными данными:

```bash
# 1. Запустите HTTP сервер
cd frontend_service/src
python -m http.server 3000

# 2. Откройте с параметром demo
http://localhost:3000/index.html?demo=true
```

**Что доступно в демо:**
-  6 готовых курсов
-  Генерация новых курсов (мокированная)
-  3D граф знаний
-  Полный UI/UX
-  Автоматический вход

 **Подробнее:** [DEMO.md](DEMO.md)

###  С реальным backend

1. Убедитесь, что backend сервис запущен на порту 8001:
```bash
cd ../backend_service
python -m uvicorn src.main:app --reload --port 8001
```

2. Запустите frontend:
```bash
cd frontend_service/src
python -m http.server 3000
```

3. Откройте в браузере: `http://localhost:3000`

## API интеграция

### Endpoints

Фронтенд интегрирован с следующими API:

- `POST /api/v1/users/register` - Регистрация
- `POST /api/v1/users/login` - Вход
- `GET /api/v1/users/me` - Текущий пользователь
- `GET /api/v1/courses` - Список всех курсов
- `GET /api/v1/courses/user/my-courses` - Мои курсы
- `POST /api/v1/courses/generate` - Генерация курса
- `GET /api/v1/courses/{id}` - Детали курса
- `DELETE /api/v1/courses/{id}` - Удаление курса
- `GET /api/v1/courses/graph` - Граф знаний

### Конфигурация

Измените базовый URL API в `src/config/api.config.js`:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:8001/api/v1',
    // ...
};
```

## Роутинг

Приложение использует hash-based роутинг:

- `#` или `#landing` - лендинг
- `#login` - вход
- `#register` - регистрация
- `#dashboard` - главная панель (требует авторизации)
- `#graph` - граф знаний (требует авторизации)
- `#course/{id}` - детали курса (требует авторизации)

## Авторизация

Токен JWT сохраняется в `localStorage` и автоматически добавляется к каждому запросу. При истечении токена пользователь перенаправляется на страницу входа.

## Компоненты

### CourseCard
Отображает информацию о курсе: название, описание, тесты, видео, категории.

### GraphView
Интерактивная 3D визуализация графа знаний с помощью Three.js:
- Ротация мышью
- Зум колесиком
- Автоматическая анимация

### SearchBar
Панель для генерации новых курсов с индикацией загрузки.

### Header
Шапка приложения с навигацией и кнопкой выхода.

### Sidebar
Боковая панель с навигацией и недавними запросами.

## Стилизация

Все стили централизованы в `src/styles/main.css` с использованием CSS Variables:

```css
:root {
    --bg-primary: #0a0a0a;
    --bg-secondary: #151515;
    --text-primary: #ffffff;
    /* ... */
}
```

## Расширение

### Добавление новой страницы

1. Создайте файл в `src/pages/`:
```javascript
export class NewPage {
    render() {
        return `<div>Your HTML here</div>`;
    }
    
    mount(parent) {
        // Mount logic
    }
    
    unmount() {
        // Cleanup
    }
}
```

2. Зарегистрируйте в `app.js`:
```javascript
this.pages = {
    // ...
    newpage: NewPage
};
```

### Добавление нового API метода

В `src/services/api.service.js`:
```javascript
async newMethod(param) {
    return await this.fetch('/api/endpoint', {
        method: 'POST',
        body: JSON.stringify({ param })
    });
}
```

## Проблемы и решения

### CORS ошибки
Если возникают CORS ошибки при работе с backend, убедитесь что CORS настроен в `backend_service/src/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Для продакшена используйте конкретные домены
    # ...
)
```

### Модули не загружаются
Используйте современный браузер с поддержкой ES6 modules или запустите через HTTP сервер (не открывайте `index.html` напрямую через `file://`).

## Разработка

### Структура компонента

Каждый компонент следует паттерну:
```javascript
export class ComponentName {
    // Конструктор
    constructor() {
        this.element = null;
    }
    
    // Рендер HTML
    render() {
        return `<div>HTML</div>`;
    }
    
    // Монтирование в DOM
    mount(parent) {
        const template = document.createElement('template');
        template.innerHTML = this.render();
        this.element = template.content.firstElementChild;
        parent.appendChild(this.element);
        this.attachEvents();
    }
    
    // Открепление от DOM
    unmount() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
    
    // Привязка событий
    attachEvents() {
        // ...
    }
}
```

## Производительность

- Ленивая загрузка модулей (dynamic imports)
- Оптимизация анимаций с requestAnimationFrame
- Минимальное использование сторонних библиотек
- Компрессия CSS при необходимости

## Безопасность

- JWT токены в localStorage (можно заменить на httpOnly cookies)
- Валидация форм на клиенте и сервере
- Escaping HTML для предотвращения XSS
- HTTPS в продакшене (обязательно)

## Лицензия

Часть проекта SuzyMiniCourse.

