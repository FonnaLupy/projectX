const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Доступ запрещён' });
    next();
};

// Все пользователи
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.id, u.last_name, u.name, u.email, u.phone, u.status, u.role, u.verified, u.blocked, 
                    u.visits, u.session_time, u.rating, u.created_at, u.last_login,
                    o.full_name_org, o.short_name, o.inn, o.ogrn, o.kpp, 
                    o.email as org_email, o.ib_phone as org_phone, o.website, o.address
             FROM users u
             LEFT JOIN organizations o ON u.id = o.user_id
             ORDER BY u.id`
        );
        const users = result.rows.map(u => ({
            id: u.id,
            lastName: u.last_name,
            name: u.name,
            email: u.email,
            phone: u.phone,
            status: u.status,
            role: u.role,
            isVerified: u.verified,
            blocked: u.blocked,
            visits: u.visits,
            sessionTime: u.session_time,
            rating: u.rating,
            registerDate: u.created_at ? new Date(u.created_at).toLocaleDateString('ru-RU') : '',
            lastLogin: u.last_login,
            organization: u.full_name_org ? {
                fullName: u.full_name_org,
                shortName: u.short_name,
                inn: u.inn,
                ogrn: u.ogrn,
                kpp: u.kpp,
                email: u.org_email,
                phone: u.org_phone,
                website: u.website,
                address: u.address,
                hasOrganization: true
            } : null
        }));
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Изменить статус
router.patch('/users/:id/status', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'inactive', 'blocked'].includes(status)) {
        return res.status(400).json({ error: 'Недопустимый статус' });
    }
    try {
        // Если статус меняется на active — снимаем блокировку
        const blocked = status === 'blocked' ? true : false;
        // Если статус active и пользователь был verified — оставляем verified
        const result = await pool.query(
            'UPDATE users SET status = $1, blocked = $2 WHERE id = $3 RETURNING id, status, blocked',
            [status, blocked, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Изменить роль
router.patch('/users/:id/role', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'expert', 'statistician', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Недопустимая роль' });
    }
    try {
        const result = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, role', [role, id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Верификация пользователя
router.patch('/users/:id/verify', requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE users SET verified = true, status = \'active\' WHERE id = $1 RETURNING id, verified, status',
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удалить пользователя
router.delete('/users/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
        res.json({ message: 'Пользователь удалён' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;