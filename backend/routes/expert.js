const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

const requireExpert = (req, res, next) => {
    if (req.user.role !== 'expert' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён' });
    }
    next();
};

router.get('/dashboard', requireExpert, async (req, res) => {
    try {
        res.json({
            projectsCount: 12,
            expertRating: 98,
            completedExpertises: 45,
            pendingReviews: 3
        });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

router.get('/tasks', requireExpert, async (req, res) => {
    res.json([]);
});

router.get('/achievements', requireExpert, async (req, res) => {
    res.json([]);
});

module.exports = router;