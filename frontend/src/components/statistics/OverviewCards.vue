<template>
  <div class="overview-grid">
    <!-- Всего пользователей -->
    <div class="overview-card" @click="$emit('card-click', 'total')">
      <div class="card-header">
        <div class="overview-icon blue">👥</div>
        <div class="card-title">Всего пользователей</div>
      </div>
      <div class="card-main-value">{{ totalUsers }}</div>
      <div class="card-stats">
        <div class="stat-row">
          <span class="stat-label">Активных:</span>
          <span class="stat-value" style="color: #16a34a;">{{ activeUsers }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Неактивных:</span>
          <span class="stat-value" style="color: #ea580c;">{{ inactiveUsers }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Заблокированных:</span>
          <span class="stat-value" style="color: #a855f7;">{{ blockedUsers }}</span>
        </div>
      </div>
    </div>

    <!-- Активных сейчас -->
    <div class="overview-card" @click="$emit('card-click', 'activeNow')">
      <div class="card-header">
        <div class="overview-icon green">✅</div>
        <div class="card-title">Активных сейчас</div>
      </div>
      <div class="card-main-value">{{ activeNow }}</div>
      <div class="card-stats">
        <div class="stat-row">
          <span class="stat-label">Процент активности:</span>
          <span class="stat-value">{{ activePercent }}%</span>
        </div>
      </div>
    </div>

    <!-- Среднее время -->
    <div class="overview-card" @click="$emit('card-click', 'averageTime')">
      <div class="card-header">
        <div class="overview-icon purple">⏱️</div>
        <div class="card-title">Среднее время</div>
      </div>
      <div class="card-main-value">{{ averageSessionTime }}</div>
      <div class="card-stats">
        <div class="stat-row">
          <span class="stat-label">Общее время:</span>
          <span class="stat-value">{{ formatTime(totalSessionTime) }}</span>
        </div>
      </div>
    </div>

    <!-- Визитов сегодня -->
    <div class="overview-card" @click="$emit('card-click', 'visits')">
      <div class="card-header">
        <div class="overview-icon orange">📈</div>
        <div class="card-title">Визитов сегодня</div>
      </div>
      <div class="card-main-value">{{ visitsToday }}</div>
      <div class="card-stats">
        <div class="stat-row">
          <span class="stat-label">Всего визитов:</span>
          <span class="stat-value">{{ totalVisits }}</span>
        </div>
      </div>
    </div>

    <!-- Средний рейтинг -->
    <div class="overview-card" @click="$emit('card-click', 'rating')">
      <div class="card-header">
        <div class="overview-icon cyan">🏆</div>
        <div class="card-title">Средний рейтинг</div>
      </div>
      <div class="card-main-value">{{ averageRating }}</div>
      <div class="card-stats">
        <div class="stat-row">
          <span class="stat-label">Максимальный:</span>
          <span class="stat-value">{{ maxUserRating }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Минимальный:</span>
          <span class="stat-value">{{ minUserRating }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  totalUsers: Number,
  activeUsers: Number,
  inactiveUsers: Number,
  blockedUsers: Number,
  activeNow: Number,
  activePercent: Number,
  averageSessionTime: String,
  totalSessionTime: Number,
  visitsToday: Number,
  totalVisits: Number,
  averageRating: Number,
  maxUserRating: Number,
  minUserRating: Number
});

defineEmits(['card-click']);

const formatTime = (seconds) => {
  if (!seconds) return '0ч 0м';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}ч ${mins}м`;
};
</script>

<style scoped>
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.overview-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.overview-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.overview-icon.blue {
  background: #dbeafe;
  color: #2563eb;
}

.overview-icon.green {
  background: #dcfce7;
  color: #16a34a;
}

.overview-icon.purple {
  background: #ede9fe;
  color: #7c3aed;
}

.overview-icon.orange {
  background: #ffedd5;
  color: #ea580c;
}

.overview-icon.cyan {
  background: #cffafe;
  color: #0891b2;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.card-main-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.card-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.stat-label {
  color: #6b7280;
}

.stat-value {
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 768px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}
</style>