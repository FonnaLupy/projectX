const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

router.post('/time', async (req, res) => {
    const { sessionTime } = req.body;
    try {
        await pool.query('UPDATE users SET session_time = $1 WHERE id = $2', [sessionTime, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;