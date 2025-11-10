# Миграции базы данных с Alembic

## Первая настройка

1. Убедитесь, что база данных создана и доступна
2. Проверьте, что DATABASE_URL в `.env` правильный

## Создание первой миграции

```bash
cd backend_service
alembic revision --autogenerate -m "Initial migration"
```

## Применение миграций

```bash
alembic upgrade head
```

## Откат миграции

```bash
alembic downgrade -1
```

## Просмотр истории миграций

```bash
alembic history
```

## Создание новой миграции после изменения моделей

```bash
alembic revision --autogenerate -m "Описание изменений"
alembic upgrade head
```

## Важные заметки

- Всегда проверяйте сгенерированные миграции перед применением
- В production делайте резервные копии перед применением миграций
- Миграции должны быть откатываемыми (reversible)

