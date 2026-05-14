const mockUsers = [
    {
        id: 1,
        last_name: 'Админов',
        name: 'Админ',
        email: 'admin@example.com',
        password: '$2a$10$0btmKN0X1k9ta2/RWsmg5eLLRJ2Ai2DfH96X3RODJtkJZ7jfvLxCe', // admin123
        role: 'admin',
        verified: true,
        blocked: false,
        status: 'active',
        created_at: '2026-01-01',
        visits: 10,
        session_time: 3600,
        rating: 1000,
        last_login: new Date().toISOString(),
        phone: null
    },
    {
        id: 2,
        last_name: 'Статистиков',
        name: 'Стат',
        email: 'stat@example.com',
        password: '$2a$10$El51z/VZU9QfBLXhlRPrsOTncducQ0/2PehNvngQc4k82ojNpdK/G', // stat123
        role: 'statistician',
        verified: true,
        blocked: false,
        status: 'active',
        created_at: '2026-02-01',
        visits: 5,
        session_time: 1800,
        rating: 800,
        last_login: new Date().toISOString(),
        phone: null
    },
    {
        id: 3,
        last_name: 'Иванов',
        name: 'Иван',
        email: 'user@example.com',
        password: '$2b$10$pqQ8DfDY0VFqwRln127QvO8.z/pzITj6XOWcoSVmqchdEJ/VFQX4m', // 123456
        role: 'user',
        verified: true,
        blocked: false,
        status: 'active',
        created_at: '2026-03-01',
        visits: 3,
        session_time: 900,
        rating: 500,
        last_login: new Date().toISOString(),
        phone: null
    },
    {
        id: 4,
        last_name: 'Экспертов',
        name: 'Эксперт',
        email: 'expert@example.com',
        password: '$2b$10$pqQ8DfDY0VFqwRln127QvO8.z/pzITj6XOWcoSVmqchdEJ/VFQX4m', // 123456
        role: 'expert',
        verified: true,
        blocked: false,
        status: 'active',
        created_at: '2026-02-15',
        visits: 8,
        session_time: 2400,
        rating: 900,
        last_login: new Date().toISOString(),
        phone: null
    },
    {
        id: 5,
        last_name: 'Петров',
        name: 'Пётр',
        email: 'pending@example.com',
        password: '$2b$10$ySkrwFDZzr56KphN7J4i2.ZX1AiOug.WmeiJJ0V9ubfZt80ufeniK', // 123456
        role: 'user',
        verified: false,
        blocked: false,
        status: 'inactive',
        created_at: '2026-04-01',
        visits: 0,
        session_time: 0,
        rating: 100,
        last_login: null,
        phone: null
    },
    {
        id: 6,
        last_name: 'Сидоров',
        name: 'Сидор',
        email: 'blocked@example.com',
        password: '$2b$10$pqQ8DfDY0VFqwRln127QvO8.z/pzITj6XOWcoSVmqchdEJ/VFQX4m', // 123456
        role: 'user',
        verified: true,
        blocked: true,
        status: 'blocked',
        created_at: '2026-03-15',
        visits: 2,
        session_time: 300,
        rating: 200,
        last_login: new Date().toISOString(),
        phone: null
    }
];

module.exports = { mockUsers };