const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

// Получить профиль
router.get('/profile', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, last_name, name, email, role, verified, blocked, status, created_at, visits, rating, session_time, phone FROM users WHERE id = $1',
            [req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
        
        const user = result.rows[0];
        res.json({
            id: user.id,
            lastName: user.last_name,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.verified,
            blocked: user.blocked,
            status: user.status,
            registerDate: user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Недавно',
            visits: user.visits || 0,
            rating: user.rating || 100,
            sessionTime: user.session_time || 0,
            phone: user.phone
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить профиль
router.put('/profile', async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id, last_name, name, email, role, verified, blocked, status',
            [name, email, phone, req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
        
        const user = result.rows[0];
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.verified,
            status: user.status
        });
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: 'Email уже используется' });
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавление организации POST /api/user/organization
router.post('/organization', async (req, res) => {
    const { full_name_org, short_name, inn, ogrn, kpp, email, ib_phone, website, address } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO organizations (full_name_org, short_name, inn, ogrn, kpp, email, ib_phone, website, address, user_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [full_name_org, short_name, inn, ogrn, kpp, email, ib_phone, website, address, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка добавления организации' });
    }
});

// Получение организации GET /api/user/organization 
router.get('/organization', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM organizations WHERE user_id = $1',
            [req.user.id]
        );
        res.json(result.rows[0] || null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка получения организации' });
    }
});

// Обновление организации
router.put('/organization', async (req, res) => {
    const { full_name_org, short_name, inn, ogrn, kpp, email, ib_phone, website, address } = req.body;
    try {
        const check = await pool.query('SELECT id FROM organizations WHERE user_id = $1', [req.user.id]);
        
        let result;
        if (check.rows.length === 0) {
            result = await pool.query(
                `INSERT INTO organizations (full_name_org, short_name, inn, ogrn, kpp, email, ib_phone, website, address, user_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 RETURNING *`,
                [full_name_org, short_name, inn, ogrn, kpp, email, ib_phone, website, address, req.user.id]
            );
        } else {
            result = await pool.query(
                `UPDATE organizations 
                 SET full_name_org = $1, short_name = $2, inn = $3, ogrn = $4, kpp = $5, 
                     email = $6, ib_phone = $7, website = $8, address = $9
                 WHERE user_id = $10
                 RETURNING *`,
                [full_name_org, short_name, inn, ogrn, kpp, email, ib_phone, website, address, req.user.id]
            );
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сохранения организации' });
    }
});

module.exports = router;