<template>
  <div class="filters-bar">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input 
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text" 
        placeholder="Поиск по имени или email..." 
        class="search-input"
      >
    </div>
    
    <select 
      :value="statusFilter"
      @change="$emit('update:statusFilter', $event.target.value)"
      class="filter-select"
    >
      <option value="all">Все статусы</option>
      <option value="active">Активные</option>
      <option value="inactive">Неактивные</option>
      <option value="blocked">Заблокированные</option>
    </select>
    
    <select 
      :value="sortBy"
      @change="$emit('update:sortBy', $event.target.value)"
      class="filter-select"
    >
      <option value="date">По дате регистрации</option>
      <option value="name">По имени</option>
      <option value="time">По времени на сайте</option>
      <option value="visits">По количеству визитов</option>
    </select>
    
    <button @click="$emit('clear')" class="btn btn-secondary btn-sm">
      🧹 Сбросить
    </button>
  </div>
</template>

<script setup>
defineProps({
  searchQuery: String,
  statusFilter: String,
  sortBy: String
});

defineEmits(['update:searchQuery', 'update:statusFilter', 'update:sortBy', 'clear']);
</script>

<style scoped>
.filters-bar {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 30px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.filter-select {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #ffffff;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #4f46e5;
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

.btn-sm {
  padding: 6px 12px;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
  }
  
  .search-box {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .btn-sm {
    width: 100%;
  }
}
</style>