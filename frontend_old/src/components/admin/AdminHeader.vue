<template>
  <header class="admin-header">
    <div class="header-title">
      <h1>
        👨‍💼 Панель Администратора
        <span class="admin-badge">ADMIN</span>
      </h1>
      <p class="header-subtitle">Управление пользователями и верификация</p>
    </div>
    <div class="header-actions">
      <button @click="$emit('refresh')" class="btn btn-secondary">
        🔄 Обновить
      </button>
      <button @click="$emit('export')" class="btn btn-primary">
        📥 Экспорт
      </button>
      <button @click="$emit('logout')" class="btn btn-danger">
        🚪 Выйти
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AdminHeader',
  emits: ['refresh', 'export', 'logout']
}
</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 20px 30px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.admin-badge {
  background: #dc2626;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.header-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #4f46e5;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn-danger {
  background-color: #ef4444;
  color: #ffffff;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .header-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>