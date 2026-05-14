<template>
  <div class="cards-grid">
    <div class="card">
      <div class="card-header">
        <div class="card-icon blue">⏱️</div>
        <div>
          <div class="card-title">На сайте</div>
          <div class="card-value">{{ formatTime(sessionTime) }}</div>
          <div class="card-subtitle">часов</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <div class="card-icon green">📅</div>
        <div>
          <div class="card-title">Визитов</div>
          <div class="card-value">{{ visits }}</div>
          <div class="card-subtitle">всего</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <div class="card-icon purple">🎯</div>
        <div>
          <div class="card-title">Активность</div>
          <div class="card-value">{{ activityLevel }}%</div>
          <div class="card-subtitle">уровень</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <div class="card-icon orange">🏆</div>
        <div>
          <div class="card-title">Рейтинг</div>
          <div class="card-value">{{ rating }}</div>
          <div class="card-subtitle">баллов</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  sessionTime: {
    type: Number,
    default: 0
  },
  visits: {
    type: Number,
    default: 0
  },
  activityLevel: {
    type: Number,
    default: 85
  },
  rating: {
    type: Number,
    default: 1000
  }
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
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.card-icon.blue {
  background: #dbeafe;
  color: #2563eb;
}

.card-icon.green {
  background: #dcfce7;
  color: #16a34a;
}

.card-icon.purple {
  background: #ede9fe;
  color: #7c3aed;
}

.card-icon.orange {
  background: #ffedd5;
  color: #ea580c;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.card-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #9ca3af;
}

@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>