# NewApp — Веб-приложение

##  Быстрый запуск (Docker)

docker-compose up -d

Открыть: http://localhost:5000

##  Тестовые аккаунты

| Email | Пароль | Роль |
|-------|--------|------|
| admin@example.com | admin123 | Администратор |
| stat@example.com | stat123 | Статистик |
| user@example.com | 123456 | Пользователь |
| expert@example.com | 123456 | Эксперт |
| pending@example.com | 123456 | Неверифицирован |
| blocked@example.com | 123456 | Заблокирован |

##  Стек

- Frontend: Vue 3 + Vue Router
- Backend: Node.js + Express
- База данных: PostgreSQL
- Аутентификация: JWT + bcrypt

##  Ручной запуск

### Бэкенд
cd backend
npm install
node server.js

### Фронтенд
cd frontend
npm install
npm run serve

##  Настройка подключения к БД

В файле `backend/.env`:

DB_USER=postgres       # имя пользователя БД
DB_PASSWORD=1310       # пароль БД
DB_HOST=postgres       # хост (postgres для Docker, localhost для локального запуска)
DB_PORT=5432
DB_NAME=NewApp         # имя базы данных

При использовании своей БД — измените эти параметры.
