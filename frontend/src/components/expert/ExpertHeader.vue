<template>
  <header class="expert-header">
    <h1>
      🧪 Панель Эксперта
      <span class="expert-badge">EXPERT</span>
    </h1>
    <div class="header-actions">
      <button @click="$emit('refresh')" class="btn btn-secondary">
        🔄 Обновить
      </button>
      <button @click="$emit('logout')" class="btn btn-danger">
        🚪 Выйти
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'ExpertHeader',
  emits: ['refresh', 'logout']
}
</script>

<style scoped>
.expert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 20px 30px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.expert-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;
}

.expert-badge {
  background: #8b5cf6;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
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

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.btn-danger {
  background-color: #ef4444;
  color: #ffffff;
}

.btn-danger:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .expert-header {
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