const API_URL = '/api';

export const api = {
  // Auth
  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка регистрации');
    return data;
  },

  async login(credentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка входа');
    return data;
  },

  async getProfile(token) {
    const response = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Ошибка загрузки профиля');
    return response.json();
  },

  async updateProfile(token, userData) {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Ошибка обновления');
    return response.json();
  },

  async getUsers(token) {
    const response = await fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Ошибка загрузки');
    return response.json();
  },

  async updateUserStatus(token, userId, status) {
    const response = await fetch(`${API_URL}/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Ошибка изменения статуса');
    return response.json();
  },

  async deleteUser(token, userId) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Ошибка удаления');
    return response.json();
  },

  async updateSessionTime(token, sessionTime) {
    const response = await fetch(`${API_URL}/session-time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ sessionTime })
    });
    return response.json();
  },

  async getStatistics(token) {
    const response = await fetch(`${API_URL}/statistics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Ошибка загрузки статистики');
    return response.json();
  },

  // ========== НОВЫЕ МЕТОДЫ ДЛЯ ЭКСПЕРТА (ДОБАВИТЬ ЭТОТ БЛОК) ==========
  
  async getExpertData(token) {
    const response = await fetch(`${API_URL}/expert/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Ошибка загрузки данных эксперта');
    return response.json();
  },

  async getExpertTasks(token) {
    const response = await fetch(`${API_URL}/expert/tasks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Ошибка загрузки задач');
    return response.json();
  },
  
  async getExpertAchievements(token) {
    const response = await fetch(`${API_URL}/expert/achievements`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Ошибка загрузки достижений');
    return response.json();
  }
  
  // ========== КОНЕЦ НОВЫХ МЕТОДОВ ==========
};