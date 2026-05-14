<template>
  <header class="stats-header">
    <h1>📊 Статистика Пользователей</h1>
    <div class="header-actions">
      <button @click="$emit('refresh')" class="btn btn-secondary">
        🔄 Обновить
      </button>
      <button @click="$emit('export')" class="btn btn-primary">
        📥 Экспорт отчёта
      </button>
      <button @click="$emit('logout')" class="btn btn-danger">
        🚪 Выйти
      </button>
    </div>
  </header>
</template>

<script setup>
defineEmits(['refresh', 'export', 'logout']);
</script>

<style scoped>
.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 20px 30px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stats-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
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

.btn-primary {
  background-color: #0891b2;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #0e7490;
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

@media (max-width: 768px) {
  .stats-header {
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