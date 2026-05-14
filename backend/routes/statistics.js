const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

const requireStatsAccess = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'statistician') {
        return res.status(403).json({ error: 'Доступ запрещён' });
    }
    next();
};

router.get('/', requireStatsAccess, async (req, res) => {
    try {
        const [totalUsers, activeUsers, inactiveUsers, blockedUsers, totalVisits, totalSessionTime, avgRating, maxRating, minRating, maxSessionTime, minSessionTime, visitsToday, top10] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM users'),
            pool.query("SELECT COUNT(*) FROM users WHERE status = 'active'"),
            pool.query("SELECT COUNT(*) FROM users WHERE status = 'inactive'"),
            pool.query("SELECT COUNT(*) FROM users WHERE status = 'blocked'"),
            pool.query('SELECT SUM(visits) FROM users'),
            pool.query('SELECT SUM(session_time) FROM users'),
            pool.query('SELECT AVG(rating) FROM users'),
            pool.query('SELECT MAX(rating) FROM users'),
            pool.query('SELECT MIN(rating) FROM users'),
            pool.query('SELECT MAX(session_time) FROM users'),
            pool.query('SELECT MIN(session_time) FROM users'),
            pool.query("SELECT COUNT(*) FROM users WHERE last_login::date = CURRENT_DATE"),
            pool.query('SELECT id, last_name, name, email, session_time, visits, rating, created_at FROM users ORDER BY (visits + session_time / 1000) DESC LIMIT 10')
        ]);
        
        // Пользователи, активные сегодня (last_login сегодня)
        const activeNowResult = await pool.query(
            "SELECT COUNT(*) FROM users WHERE last_login::date = CURRENT_DATE AND status = 'active'"
        );

        res.json({
            totalUsers: parseInt(totalUsers.rows[0].count),
            activeUsers: parseInt(activeUsers.rows[0].count),
            inactiveUsers: parseInt(inactiveUsers.rows[0].count),
            blockedUsers: parseInt(blockedUsers.rows[0].count),
            totalVisits: parseInt(totalVisits.rows[0].sum || 0),
            totalSessionTime: parseInt(totalSessionTime.rows[0].sum || 0),
            avgRating: Math.round(avgRating.rows[0].avg || 0),
            maxRating: parseInt(maxRating.rows[0].max || 0),
            minRating: parseInt(minRating.rows[0].min || 0),
            maxSessionTime: parseInt(maxSessionTime.rows[0].max || 0),
            minSessionTime: parseInt(minSessionTime.rows[0].min || 0),
            visitsToday: parseInt(visitsToday.rows[0].count || 0),
            activeNow: parseInt(activeNowResult.rows[0].count),
            top10Users: top10.rows.map(u => ({
                id: u.id,
                lastName: u.last_name,
                name: u.name,
                email: u.email,
                sessionTime: u.session_time,
                visits: u.visits,
                rating: u.rating,
                registerDate: u.created_at ? new Date(u.created_at).toLocaleDateString('ru-RU') : ''
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;