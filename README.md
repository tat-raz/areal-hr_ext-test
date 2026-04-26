# HR Management System

Веб-приложение для учета сотрудников в нескольких организациях.

---

## Используемые технологии

### Операционная система
- macOS

### IDE
- Visual Studio Code

### Frontend
- Vue.js (3.x)
- Quasar
- Vite
- TypeScript

### Backend
- Node.js
- NestJS

### База данных
- PostgreSQL  
- Установка: через Docker

### Контейнеризация
- Docker
- Docker Compose

### Дополнительно
- pg — работа с БД
- node-pg-migrate — миграции
- @nestjs/passport — аутентификация
- joi — валидация

---
### Схема базы данных

<img width="1654" height="1169" alt="Схема БД drawio" src="https://github.com/user-attachments/assets/f8e21ed7-8739-4187-89d5-8fe7f0daf827" />


---


## Работа с Git

В проекте используется система контроля версий Git.

### Основные команды

- `git init` — инициализация репозитория  
- `git status` — просмотр текущего состояния файлов  
- `git add .` — добавление файлов в индекс  
- `git commit -m "сообщение"` — создание коммита с описанием изменений  
- `git log --oneline` — просмотр истории коммитов  
- `git push` — отправка изменений в удалённый репозиторий


## Аутентификация и авторизация

В проекте реализована session-based аутентификация с использованием Passport (Local Strategy).

Login:
POST /auth/login
{
  "login": "test_user",
  "password": "1234567"
}

После успешного входа создаётся session, которая используется для последующих запросов.

Текущий пользователь:
GET /auth/me

Logout:
POST /auth/logout

## Роли пользователей

В системе используются роли:

admin — полный доступ ко всем сущностям и управление пользователями  
hr_manager — доступ к кадровым данным (сотрудники, департаменты, должности, операции)

## Доступ к API

Доступ к эндпоинтам ограничен с помощью Guards:

/users — доступ только для admin

остальные сущности:
- /employees
- /departments
- /positions
- /organizations
- /files
- /hr-operations

доступны для:
- admin
- hr_manager

