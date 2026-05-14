<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h3 class="modal-title">{{ title }}</h3>
      <div class="modal-content">
        <div v-if="type === 'total'" class="modal-section">
          <div class="modal-section-title">Общая статистика</div>
          <div class="stat-detail">
            <span class="stat-label-detail">Всего пользователей:</span>
            <span class="stat-value-detail">{{ data.totalUsers }}</span>
          </div>
          <div class="stat-detail">
            <span class="stat-label-detail">Активных:</span>
            <span class="stat-value-detail" style="color: #16a34a;">{{ data.activeUsers }}</span>
          </div>
          <div class="stat-detail">
            <span class="stat-label-detail">Неактивных:</span>
            <span class="stat-value-detail" style="color: #ea580c;">{{ data.inactiveUsers }}</span>
          </div>
          <div class="stat-detail">
            <span class="stat-label-detail">Заблокированных:</span>
            <span class="stat-value-detail" style="color: #a855f7;">{{ data.blockedUsers }}</span>
          </div>
        </div>

        <div v-else-if="type === 'activeNow'" class="modal-section">
          <div class="modal-section-title">Текущая активность</div>
          <div class="stat-detail">
            <span class="stat-label-detail">Активных сейчас:</span>
            <span class="stat-value-detail">{{ data.activeNow }}</span>
          </div>
          <div class="stat-detail">
            <span class="stat-label-detail">Процент активности:</span>
            <span class="stat-value-detail">{{ data.activePercent }}%</span>
          </div>
        </div>

        <div v-else-if="type === 'averageTime'" class="modal-section">
          <div class="modal-section-title">Время на сайте</div>
          <div class="stat-detail">
            <span class="stat-label-detail">Среднее время:</span>
            <span class="stat-value-detail">{{ data.averageSessionTime }}</span>
          </div>
          <div class="stat-detail">
            <span class="stat-label-detail">Общее время всех:</span>
            <span class="stat-value-detail">{{ formatTime(data.totalSessionTime) }}</span>
          </div>
          <div class="stat-detail">
            <span class="stat-label-detail">Максимум:</span>
            <span class="stat-value-detail">{{ formatTime(data.maxSessionTime) }}</span>
          </div>
          <div class="stat-detail">
            <span class="stat-label-detail">Минимум:</span>
            <span class="stat-value-detail">{{ formatTime(data.minSessionTime) }}</span>
          </div>
        </div>

        <div v-else-if="type === 'visits'" class="modal-section">
          <div class="modal-section-title">Статистика визитов</div>
          <div class="stat-detail">
            <span class="stat-label-detail">Сегодня:</span>
            <span class="stat-value-detail">{{ data.visitsToday }}</span>
          </div>
          <div class="stat-detail">
            <span class="stat-label-detail">Всего визитов:</span>
            <span class="stat-value-detail">{{ data.totalVisits }}</span>
          </div>
          <div class="stat-detail">
            <span class="stat-label-detail">Среднее за пользователя:</span>
            <span class="stat-value-detail">{{ data.averageVisits }}</span>
          </div>
        </div>

        <div v-else-if="type === 'rating'" class="modal-section">
          <div class="modal-section-title">Рейтинг пользователей</div>
          <div class="stat-detail">
            <span class="stat-label-detail">Средний:</span>
            <span class="stat-value-detail">{{ data.averageRating }}</span>
          </div>
          <div class="stat-detail">
            <span class="stat-label-detail">Максимальный:</span>
            <span class="stat-value-detail">{{ data.maxUserRating }}</span>
          </div>
          <div class="stat-detail">
            <span class="stat-label-detail">Минимальный:</span>
            <span class="stat-value-detail">{{ data.minUserRating }}</span>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button @click="$emit('close')" class="btn btn-secondary">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);

const formatTime = (seconds) => {
  if (!seconds) return '0ч 0м';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}ч ${mins}м`;
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
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

.modal-content {
  margin-bottom: 24px;
}

.modal-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.modal-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.stat-detail {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.stat-detail:last-child {
  border-bottom: none;
}

.stat-label-detail {
  font-weight: 500;
  color: #6b7280;
}

.stat-value-detail {
  font-weight: 600;
  color: #111827;
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
    max-height: 90vh;
    padding: 20px;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
}
</style>