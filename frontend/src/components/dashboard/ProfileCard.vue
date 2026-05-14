<template>
  <div class="profile-card">
    <div class="profile-header">
      <div class="avatar">{{ userInitials }}</div>
      <div class="profile-info">
        <h2>{{ user.name }}</h2>
        <p>Зарегистрирован {{ user.registerDate }}</p>
      </div>
    </div>

    <div class="profile-details">
      <div class="detail-item">
        <span class="detail-label">Имя</span>
        <div class="detail-value">{{ user.name }}</div>
      </div>
      
      <div class="detail-item">
        <span class="detail-label">Email</span>
        <div class="detail-value">{{ user.email }}</div>
      </div>
      
      <div class="detail-item">
        <span class="detail-label">Телефон</span>
        <div class="detail-value">{{ user.phone || 'Не указан' }}</div>
      </div>
      
      <div class="detail-item">
        <span class="detail-label">Статус</span>
        <div class="detail-value">
          <span :style="{ color: user.status === 'active' ? '#22c55e' : '#ef4444' }">
            {{ user.status === 'active' ? 'Активен' : 'Неактивен' }}
          </span>
        </div>
      </div>
    </div>

    <div class="timer-display">
      Время на сайте: {{ formatTime(sessionTime) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  sessionTime: {
    type: Number,
    default: 0
  }
});

const userInitials = computed(() => {
  const names = props.user.name?.split(' ') || [];
  return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return '00:00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.profile-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  border: 4px solid #e5e7eb;
}

.profile-info h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.profile-info p {
  color: #6b7280;
  font-size: 0.875rem;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
}

.detail-value {
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  padding: 10px 14px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.timer-display {
  font-family: 'Courier New', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: #4f46e5;
  text-align: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px dashed #d1d5db;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .timer-display {
    font-size: 1.875rem;
  }
}
</style>