-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    verified BOOLEAN DEFAULT FALSE,
    blocked BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'inactive',
    phone VARCHAR(50),
    visits INTEGER DEFAULT 0,
    session_time INTEGER DEFAULT 0,
    rating INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    CONSTRAINT users_role_check CHECK (role IN ('user', 'expert', 'statistician', 'admin')),
    CONSTRAINT users_status_check CHECK (status IN ('active', 'inactive', 'blocked'))
);

-- Таблица организаций
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name_org VARCHAR(500) NOT NULL,
    short_name VARCHAR(200),
    inn VARCHAR(20),
    ogrn VARCHAR(20),
    kpp VARCHAR(20),
    email VARCHAR(255),
    ib_phone VARCHAR(50),
    website VARCHAR(255),
    address TEXT
);

-- Тестовые пользователи

-- Админ (admin123)
INSERT INTO users (last_name, name, email, password, role, verified, blocked, status) 
VALUES ('Админов', 'Админ', 'admin@example.com', 
        '$2a$10$0btmKN0X1k9ta2/RWsmg5eLLRJ2Ai2DfH96X3RODJtkJZ7jfvLxCe',
        'admin', true, false, 'active')
ON CONFLICT (email) DO NOTHING;

-- Статистик (stat123)
INSERT INTO users (last_name, name, email, password, role, verified, blocked, status) 
VALUES ('Статистиков', 'Стат', 'stat@example.com',
        '$2a$10$67yBujEPja3C7mngv.ZaseOGnm5.p2GLxHFd6yCGNnXlPYHJYDE8q',
        'statistician', true, false, 'active')
ON CONFLICT (email) DO NOTHING;

-- Пользователь (123456)
INSERT INTO users (last_name, name, email, password, role, verified, blocked, status) 
VALUES ('Иванов', 'Иван', 'user@example.com',
        '$2b$10$pqQ8DfDY0VFqwRln127QvO8.z/pzITj6XOWcoSVmqchdEJ/VFQX4m',
        'user', true, false, 'active')
ON CONFLICT (email) DO NOTHING;

-- Эксперт (123456)
INSERT INTO users (last_name, name, email, password, role, verified, blocked, status) 
VALUES ('Экспертов', 'Эксперт', 'expert@example.com',
        '$2b$10$pqQ8DfDY0VFqwRln127QvO8.z/pzITj6XOWcoSVmqchdEJ/VFQX4m',
        'expert', true, false, 'active')
ON CONFLICT (email) DO NOTHING;

-- Неверифицированный (123456)
INSERT INTO users (last_name, name, email, password, role, verified, blocked, status) 
VALUES ('Петров', 'Пётр', 'pending@example.com',
        '$2b$10$pqQ8DfDY0VFqwRln127QvO8.z/pzITj6XOWcoSVmqchdEJ/VFQX4m',
        'user', false, false, 'inactive')
ON CONFLICT (email) DO NOTHING;

-- Заблокированный (123456)
INSERT INTO users (last_name, name, email, password, role, verified, blocked, status) 
VALUES ('Сидоров', 'Сидор', 'blocked@example.com',
        '$2b$10$pqQ8DfDY0VFqwRln127QvO8.z/pzITj6XOWcoSVmqchdEJ/VFQX4m',
        'user', true, true, 'blocked')
ON CONFLICT (email) DO NOTHING;