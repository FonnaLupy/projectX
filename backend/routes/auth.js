const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true';

// В мок-режиме пароли проверяем просто
const testPasswords = {
    'admin123': true,
    'stat123': true,
    '123456': true,
    '1234562': true,
};

// Регистрация
router.post('/register', async (req, res) => {
    if (USE_MOCK_DB) {
        return res.status(201).json({
            user: {
                id: Math.floor(Math.random() * 1000) + 10,
                last_name: req.body.lastName,
                name: req.body.name,
                email: req.body.email,
                role: 'user',
                verified: false,
                blocked: false,
                status: 'inactive'
            },
            token: jwt.sign({ id: 999, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' })
        });
    }
    
    const { lastName, name, email, password } = req.body;
    if (!lastName || !name || !email || !password) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    
    try {
        const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Email уже используется' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        // Принимаем роль из запроса, по умолчанию 'user'
        const role = req.body.role || 'user';
        // Разрешённые роли при регистрации
        const allowedRoles = ['user', 'expert', 'statistician'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ error: 'Недопустимая роль' });
        }

        const result = await pool.query(
            `INSERT INTO users (last_name, name, email, password, role, verified, blocked, status)
            VALUES ($1, $2, $3, $4, $5, false, false, 'inactive')
            RETURNING id, last_name, name, email, role, verified, blocked, status`,
            [lastName, name, email, hashedPassword, role]
        );
        
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Вход
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' });
    }
    
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Неверный Email или пароль' });
        }
        
        const user = result.rows[0];
        
        let isMatch;
        if (USE_MOCK_DB) {
            isMatch = testPasswords[password] || false;
        } else {
            isMatch = await bcrypt.compare(password, user.password);
        }
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Неверный Email или пароль' });
        }
        
        if (user.blocked) {
            return res.status(403).json({ error: 'Ваша учётная запись заблокирована. Обратитесь к администратору.', code: 'ACCOUNT_BLOCKED' });
        }
        
        if (!user.verified) {
            return res.status(403).json({ error: 'Ваша учётная запись ожидает верификации администратором.', code: 'ACCOUNT_NOT_VERIFIED' });
        }
        
        await pool.query('UPDATE users SET visits = visits + 1, last_login = NOW() WHERE id = $1', [user.id]);
        
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...userData } = user;
        userData.isVerified = user.verified;
        res.json({ user: userData, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;