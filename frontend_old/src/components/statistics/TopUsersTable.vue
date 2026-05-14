<template>
  <div class="top10-section">
    <div class="top10-header">
      <h2>🏆 Топ-10 самых активных пользователей</h2>
    </div>
    <div class="table-wrapper">
      <table v-if="users.length > 0">
        <thead>
          <tr>
            <th>#</th>
            <th>Пользователь</th>
            <th>Email</th>
            <th>Время на сайте</th>
            <th>Визиты</th>
            <th>Рейтинг</th>
            <th>Дата регистрации</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.id">
            <td class="rank">{{ index + 1 }}</td>
            <td>
              <div class="user-cell">
                <div class="user-avatar">{{ getUserInitials(user) }}</div>
                <span class="user-name">{{ user.lastName }} {{ user.name }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ formatTime(user.sessionTime) }}</td>
            <td>{{ user.visits }}</td>
            <td>{{ user.rating }}</td>
            <td>{{ user.registerDate }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Нет данных для отображения</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  users: {
    type: Array,
    default: () => []
  }
});

const getUserInitials = (user) => {
  const lastName = user.lastName || '';
  const name = user.name || '';
  return `${lastName.charAt(0)}${name.charAt(0)}`.toUpperCase();
};

const formatTime = (seconds) => {
  if (!seconds) return '0ч 0м';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}ч ${mins}м`;
};
</script>

<style scoped>
.top10-section {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.top10-header {
  padding: 20px 30px;
  border-bottom: 1px solid #e5e7eb;
}

.top10-header h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
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

.rank {
  font-weight: 700;
  color: #4f46e5;
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

.user-name {
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

@media (max-width: 768px) {
  .table-wrapper {
    overflow-x: auto;
  }
  
  table {
    min-width: 600px;
  }
  
  th, td {
    padding: 12px 10px;
  }
}
</style>