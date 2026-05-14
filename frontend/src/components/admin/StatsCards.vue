<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon blue">👥</div>
      <div class="stat-info">
        <h3>Всего пользователей</h3>
        <p>{{ totalUsers }}</p>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon green">✅</div>
      <div class="stat-info">
        <h3>Активных</h3>
        <p>{{ activeUsers }}</p>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon purple">⏱️</div>
      <div class="stat-info">
        <h3>Среднее время</h3>
        <p>{{ averageTime }}</p>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon orange">📈</div>
      <div class="stat-info">
        <h3>Новых за неделю</h3>
        <p>{{ newUsersThisWeek }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsCards',
  props: {
    totalUsers: {
      type: Number,
      default: 0
    },
    activeUsers: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: String,
      default: '0ч 0м'
    },
    newUsersThisWeek: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.stat-icon.blue {
  background: #dbeafe;
  color: #2563eb;
}

.stat-icon.green {
  background: #dcfce7;
  color: #16a34a;
}

.stat-icon.purple {
  background: #ede9fe;
  color: #7c3aed;
}

.stat-icon.orange {
  background: #ffedd5;
  color: #ea580c;
}

.stat-info h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-info p {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card {
    padding: 18px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .stat-info p {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>