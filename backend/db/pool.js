const { Pool } = require('pg');
const { mockUsers } = require('./mockUsers');

const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true';
let pool = null;

if (!USE_MOCK_DB) {
    pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '1310',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'NewApp',
        ssl: false,
        connectionTimeoutMillis: 5000,
        max: 20
    });
    
    pool.connect().then(client => {
        console.log('✅ PostgreSQL подключена');
        client.release();
    }).catch(err => {
        console.error('❌ Ошибка подключения к PostgreSQL:', err.message);
    });
}

// Мок-функция query
const mockQuery = async (text, params = []) => {
    console.log('🎭 [MOCK]', text.substring(0, 80), params);
    
    // SELECT * FROM users WHERE email = $1
    if (text.includes('FROM users WHERE email = $1')) {
        const user = mockUsers.find(u => u.email === params[0]);
        return { rows: user ? [{ ...user }] : [] };
    }
    
    // SELECT ... FROM users WHERE id = $1
    if (text.includes('FROM users WHERE id = $1')) {
        const user = mockUsers.find(u => u.id === params[0]);
        return { rows: user ? [{ ...user }] : [] };
    }
    
    // SELECT COUNT(*)
    if (text.includes('SELECT COUNT(*) FROM users')) {
        let users = [...mockUsers];
        if (text.includes("status = 'active'")) users = users.filter(u => u.status === 'active');
        else if (text.includes("status = 'inactive'")) users = users.filter(u => u.status === 'inactive');
        else if (text.includes("status = 'blocked'")) users = users.filter(u => u.status === 'blocked');
        else if (text.includes('last_login::date = CURRENT_DATE')) {
            const today = new Date().toDateString();
            users = users.filter(u => u.last_login && new Date(u.last_login).toDateString() === today);
        }
        return { rows: [{ count: users.length }] };
    }
    
    // SELECT SUM/AVG/MAX/MIN
    if (text.includes('SUM(visits)')) {
        const sum = mockUsers.reduce((s, u) => s + (u.visits || 0), 0);
        return { rows: [{ sum }] };
    }
    if (text.includes('SUM(session_time)')) {
        const sum = mockUsers.reduce((s, u) => s + (u.session_time || 0), 0);
        return { rows: [{ sum }] };
    }
    if (text.includes('AVG(rating)')) {
        const avg = mockUsers.reduce((s, u) => s + (u.rating || 0), 0) / mockUsers.length;
        return { rows: [{ avg }] };
    }
    if (text.includes('MAX(rating)')) {
        const max = Math.max(...mockUsers.map(u => u.rating || 0));
        return { rows: [{ max }] };
    }
    if (text.includes('MIN(rating)')) {
        const min = Math.min(...mockUsers.map(u => u.rating || 0));
        return { rows: [{ min }] };
    }
    if (text.includes('MAX(session_time)')) {
        const max = Math.max(...mockUsers.map(u => u.session_time || 0));
        return { rows: [{ max }] };
    }
    if (text.includes('MIN(session_time)')) {
        const min = Math.min(...mockUsers.map(u => u.session_time || 0));
        return { rows: [{ min }] };
    }
    
    // SELECT ... FROM users ORDER BY id
    if (text.includes('FROM users ORDER BY id')) {
        return { rows: [...mockUsers].sort((a, b) => a.id - b.id) };
    }
    
    // SELECT ... LIMIT 10 (топ-10)
    if (text.includes('LIMIT 10')) {
        const sorted = [...mockUsers].sort((a, b) => (b.visits + b.session_time / 1000) - (a.visits + a.session_time / 1000));
        return { rows: sorted.slice(0, 10) };
    }
    
    // UPDATE users SET visits = visits + 1
    if (text.includes('visits = visits + 1')) {
        const user = mockUsers.find(u => u.id === params[0]);
        if (user) { user.visits += 1; user.last_login = new Date().toISOString(); }
        return { rows: [] };
    }
    
    // UPDATE users SET session_time = $1
    if (text.includes('session_time = $1')) {
        const user = mockUsers.find(u => u.id === params[1]);
        if (user) user.session_time = params[0];
        return { rows: [] };
    }
    
    // INSERT INTO users (регистрация в моке не сохраняется, но возвращаем "успех")
    if (text.includes('INSERT INTO users')) {
        const newUser = {
            id: mockUsers.length + 1,
            last_name: params[0],
            name: params[1],
            email: params[2],
            role: 'user',
            verified: false,
            blocked: false,
            status: 'inactive'
        };
        return { rows: [newUser] };
    }
    
    // DELETE FROM users
    if (text.includes('DELETE FROM users')) {
        return { rows: [{ id: params[0] }] };
    }
    
    // UPDATE users SET status/role
    if (text.includes('UPDATE users SET status')) {
        const user = mockUsers.find(u => u.id === params[1]);
        if (user) user.status = params[0];
        return { rows: [{ id: params[1], status: params[0] }] };
    }
    if (text.includes('UPDATE users SET role')) {
        const user = mockUsers.find(u => u.id === params[1]);
        if (user) user.role = params[0];
        return { rows: [{ id: params[1], role: params[0] }] };
    }
    
    // organizations
    if (text.includes('organizations')) {
        if (text.includes('INSERT') || text.includes('UPDATE')) {
            return { rows: [{ id: 1, ...params, user_id: params[9] || params[0] }] };
        }
        return { rows: [] };
    }
    
    return { rows: [] };
};

if (USE_MOCK_DB) {
    module.exports = { query: mockQuery };
} else {
    module.exports = pool;
}