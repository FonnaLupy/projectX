<template>
  <div class="statistics-placeholder">
    <div class="placeholder-content">
      <div class="placeholder-icon">📊</div>
      <h2>Статистика пользователя</h2>
      <p>Здесь будет отображаться ваша статистика активности</p>
      <div class="placeholder-stats">
        <div class="stat-item">
          <div class="stat-value">{{ visits }}</div>
          <div class="stat-label">Визитов</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ timeOnSite }}</div>
          <div class="stat-label">Времени на сайте</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ hasOrganization ? '✅' : '❌' }}</div>
          <div class="stat-label">Заполнена форма</div>
        </div>
      </div>
      <p class="coming-soon">🚀 Скоро здесь появится подробная статистика</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatisticsPlaceholder',
  props: {
    visits: {
      type: Number,
      default: 0
    },
    timeOnSite: {
      type: String,
      default: '0ч 0м'
    },
    hasOrganization: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.statistics-placeholder {
  background: white;
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  max-width: 500px;
  margin: 0 auto;
}

.placeholder-icon {
  font-size: 5rem;
  margin-bottom: 24px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.placeholder-content h2 {
  font-size: 1.875rem;
  color: #1e293b;
  margin-bottom: 12px;
}

.placeholder-content p {
  color: #64748b;
  margin-bottom: 32px;
}

.placeholder-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
}

.coming-soon {
  font-size: 0.875rem;
  color: #94a3b8;
  padding: 12px;
  background: #f1f5f9;
  border-radius: 8px;
  display: inline-block;
}

@media (max-width: 768px) {
  .placeholder-stats {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>