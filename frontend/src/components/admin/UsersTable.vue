<template>
  <div class="table-container">
    <div class="table-header">
      <h2>📋 Список пользователей</h2>
      <span class="user-count">
        Показано {{ users.length }} из {{ totalUsers }}
      </span>
    </div>
    
    <div class="table-wrapper">
      <table v-if="users.length > 0">
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Email</th>
            <th>Статус</th>
            <th>Время на сайте</th>
            <th>Визиты</th>
            <th>Дата регистрации</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <div class="user-cell">
                <div class="user-avatar">
                  {{ getUserInitials(user) }}
                </div>
                <div class="user-info">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-email">ID: {{ user.id }}</span>
                </div>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(user.status)]">
                {{ getStatusText(user.status) }}
              </span>
            </td>
            <td>{{ formatTime(user.sessionTime) }}</td>
            <td>{{ user.visits }}</td>
            <td>{{ user.registerDate }}</td>
            <td>
              <div class="actions-cell">
                <button @click="$emit('view', user)" class="btn btn-secondary btn-sm" title="Просмотр">
                  👁️
                </button>
                <button @click="$emit('toggle-status', user)" class="btn btn-primary btn-sm" :title="user.status === 'active' ? 'Заблокировать' : 'Активировать'">
                  {{ user.status === 'active' ? '🚫' : '✅' }}
                </button>
                <button @click="$emit('delete', user)" class="btn btn-danger btn-sm" title="Удалить">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-else class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>Пользователи не найдены</h3>
        <p>Попробуйте изменить параметры поиска или фильтры</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  users: {
    type: Array,
    default: () => []
  },
  totalUsers: {
    type: Number,
    default: 0
  }
});

defineEmits(['view', 'toggle-status', 'delete']);

const getUserInitials = (user) => {
  const name = user.name || '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatTime = (seconds) => {
  if (!seconds) return '0ч 0м';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}ч ${mins}м`;
};

const getStatusClass = (status) => {
  const classes = {
    active: 'status-active',
    inactive: 'status-inactive',
    blocked: 'status-blocked'
  };
  return classes[status] || 'status-inactive';
};

const getStatusText = (status) => {
  const texts = {
    active: 'Активен',
    inactive: 'Неактивен',
    blocked: 'Заблокирован'
  };
  return texts[status] || 'Неизвестно';
};
</script>

<style scoped>
.table-container {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.table-header {
  padding: 20px 30px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
}

.user-count {
  color: #6b7280;
  font-size: 0.875rem;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
}

th {
  padding: 14px 20px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #1f2937;
}

tr:hover {
  background: #f9fafb;
}

tr:last-child td {
  border-bottom: none;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: #ffffff;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #111827;
}

.user-email {
  font-size: 0.75rem;
  color: #9ca3af;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-blocked {
  background: #fef3c7;
  color: #92400e;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  font-size: 0.75rem;
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

.btn-sm {
  padding: 6px 12px;
  font-size: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-state-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  th, td {
    padding: 12px 10px;
  }
  
  .actions-cell {
    flex-direction: column;
  }
  
  .btn-sm {
    width: 100%;
  }
}
</style>