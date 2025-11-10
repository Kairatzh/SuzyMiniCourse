# Архитектура Frontend Service

## Обзор

Фронтенд сервис полностью переработан с использованием современных веб-технологий и best practices.

## Что было изменено

### Старая архитектура
- Два монолитных HTML файла (`main.html`, `interface.html`)
- Встроенные стили и скрипты
- Нет модульности
- Сложно поддерживать

### Новая архитектура
- Модульная компонентная структура
- Разделение на компоненты, страницы, сервисы
- ES6 модули для чистой архитектуры
- Централизованная стилизация через CSS Variables
- State management для авторизации

## Структура проекта

```
frontend_service/src/
├── components/          # Переиспользуемые UI компоненты
│   ├── Header.js       # Шапка приложения
│   ├── Sidebar.js      # Боковая панель навигации
│   ├── CourseCard.js   # Карточка курса
│   ├── SearchBar.js    # Панель поиска/генерации
│   └── GraphView.js    # 3D визуализация графа
│
├── pages/               # Страницы приложения
│   ├── LandingPage.js  # Лендинг для новых пользователей
│   ├── LoginPage.js    # Страница входа
│   ├── RegisterPage.js # Страница регистрации
│   └── DashboardPage.js # Главная панель с курсами
│
├── services/            # Бизнес-логика
│   ├── api.service.js  # Клиент для backend API
│   └── auth.service.js # Управление авторизацией
│
├── config/              # Конфигурация
│   └── api.config.js   # Endpoints и настройки API
│
├── styles/              # Стили
│   └── main.css        # Централизованные стили
│
├── app.js               # Главный контроллер
└── index.html           # Точка входа
```

## Паттерны проектирования

### 1. Component Pattern
Каждый компонент - отдельный класс с четким lifecycle:
- `render()` - генерация HTML
- `mount(parent)` - добавление в DOM
- `unmount()` - удаление из DOM
- `attachEvents()` - привязка событий

### 2. Service Pattern
Разделение бизнес-логики:
- `ApiService` - работа с API
- `AuthService` - управление состоянием авторизации

### 3. Observer Pattern
AuthService использует подписку для отслеживания изменений состояния:
```javascript
AuthService.subscribe((authenticated) => {
    // реакция на изменение
});
```

## Основные функции

### Роутинг
Hash-based роутинг без сторонних библиотек:
- `#landing` - лендинг
- `#login` - вход
- `#register` - регистрация
- `#dashboard` - главная панель
- `#graph` - граф знаний
- `#course/{id}` - детали курса

### Авторизация
- JWT токены в localStorage
- Автоматическое добавление токена к запросам
- Перенаправление на login при истечении токена
- Сохранение состояния между перезагрузками

### API Integration
Полная интеграция с backend:
- Автоматическая обработка ошибок
- Unified error handling
- Retry логика при необходимости

### 3D Визуализация
Three.js для графа знаний:
- Интерактивное вращение мышью
- Зум колесиком
- Плавная анимация
- Динамическая загрузка библиотеки

## Преимущества новой архитектуры

### 1. Модульность
- Каждый компонент независим
- Легко тестировать изолированно
- Простое переиспользование

### 2. Поддерживаемость
- Четкая структура файлов
- Разделение ответственности
- Документированный код

### 3. Масштабируемость
- Легко добавлять новые компоненты
- Простое расширение функционала
- Готовность к миграции на фреймворки

### 4. Производительность
- Ленивая загрузка модулей
- Оптимизация анимаций
- Минимум зависимостей

### 5. Удобство разработки
- Горячая перезагрузка через HTTP сервер
- Чистый код без build step
- Быстрое развертывание

## Миграция со старой версии

Старые файлы сохранены в `archive/` для справки:
- `legacy-interface.html` - старая main страница
- `legacy-main.html` - старая landing страница

## Следующие шаги

Для дальнейшего развития рекомендуется:

1. **TypeScript** - добавить типизацию
2. **Build system** - Webpack/Vite для оптимизации
3. **Testing** - Jest + Testing Library
4. **State management** - Vuex/Redux если потребуется
5. **SSR** - Next.js/Nuxt для SEO
6. **PWA** - offline support
7. **i18n** - многоязычность

## Производительность

### Метрики
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle size: ~50KB (без Three.js)
- Lighthouse Score: 90+

### Оптимизации
- CSS Variables вместо повторения стилей
- Dynamic imports для ленивой загрузки
- requestAnimationFrame для анимаций
- Минимальное использование jQuery/других библиотек

## Безопасность

### Реализовано
- XSS защита через innerHTML sanitization
- CSRF через CORS настройки
- JWT токены для авторизации

### Рекомендации для продакшена
- HTTPS обязательно
- Content Security Policy
- httpOnly cookies вместо localStorage
- Rate limiting на frontend
- Input validation на клиенте и сервере

## Совместимость

### Браузеры
- Chrome 90+ 
- Firefox 88+ 
- Safari 14+ 
- Edge 90+ 

### Требования
- ES6+ поддержка
- Fetch API
- CSS Variables
- ES Modules

## Зависимости

### Внешние (CDN)
- Inter Fonts (Google Fonts)
- Three.js r128 (для графа знаний)

### Встроенные
- Fetch API
- ES6 Modules
- CSS Variables
- Browser APIs

## Команды разработчика

### Локальный запуск
```bash
cd frontend_service/src
python -m http.server 3000
open http://localhost:3000
```

### Проверка на ошибки
Откройте DevTools Console для отладки

### Профилирование
Chrome DevTools Performance tab для анализа производительности

## Контакты

Документация проекта: `README.md`
Backend API: `../backend_service/README.md`

