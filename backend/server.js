require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

// Определяем путь к фронтенду
let frontendPath;
const possiblePaths = [
    path.join(__dirname, '../frontend/public'),
    path.join(__dirname, 'frontend'),
    path.join(__dirname, '../src'),
];
for (const p of possiblePaths) {
    if (fs.existsSync(path.join(p, 'index.html'))) {
        frontendPath = p;
        break;
    }
}
if (frontendPath) {
    app.use(express.static(frontendPath));
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mock: process.env.USE_MOCK_DB === 'true' });
});

// Подключаем роуты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/session', require('./routes/session'));
app.use('/api/statistics', require('./routes/statistics'));
app.use('/api/expert', require('./routes/expert'));

// Отдаём index.html для всех остальных GET-запросов (SPA)
app.get('*', (req, res) => {
    if (frontendPath) {
        res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
        res.json({ message: 'API works' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер на порту ${PORT}, мок-режим: ${process.env.USE_MOCK_DB === 'true'}`);
});