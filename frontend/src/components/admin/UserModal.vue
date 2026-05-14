<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h3 class="modal-title">{{ title }}</h3>
      <div class="modal-content">
        <div class="modal-section">
          <div class="detail-row">
            <span class="detail-label">👤 Имя:</span>
            <span class="detail-value">{{ user.name }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">📧 Email:</span>
            <span class="detail-value">{{ user.email }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">📱 Телефон:</span>
            <span class="detail-value">{{ user.phone || 'Не указан' }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">🔘 Статус:</span>
            <span class="detail-value">
              <span :class="['status-badge', getStatusClass(user.status)]">
                {{ getStatusText(user.status) }}
              </span>
            </span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">🆔 ID:</span>
            <span class="detail-value">{{ user.id }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">📅 Дата регистрации:</span>
            <span class="detail-value">{{ user.registerDate }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">⏱️ Время на сайте:</span>
            <span class="detail-value">{{ formatTime(user.sessionTime) }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">👁️ Количество визитов:</span>
            <span class="detail-value">{{ user.visits }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">🏆 Рейтинг:</span>
            <span class="detail-value">{{ user.rating }} баллов</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">🕐 Последний вход:</span>
            <span class="detail-value">{{ user.lastLogin || 'Никогда' }}</span>
          </div>
          
          <div class="detail-row" v-if="user.lastName">
            <span class="detail-label">👪 Фамилия:</span>
            <span class="detail-value">{{ user.lastName }}</span>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button @click="$emit('close')" class="btn btn-secondary">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: 'Информация о пользователе'
  }
});

defineEmits(['close']);

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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

.modal-content {
  margin-bottom: 24px;
}

.modal-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.detail-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-value {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
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

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
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

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .modal {
    padding: 20px;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>