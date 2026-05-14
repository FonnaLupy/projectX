<template>
  <div v-if="totalPages > 0" class="pagination">
    <div class="pagination-info">
      Страница {{ currentPage }} из {{ totalPages }}
    </div>
    <div class="pagination-controls">
      <button 
        @click="$emit('change-page', currentPage - 1)" 
        :disabled="currentPage === 1"
        class="page-btn"
      >
        ← Назад
      </button>
      
      <button 
        v-for="page in visiblePages" 
        :key="page"
        @click="$emit('change-page', page)"
        :class="['page-btn', { active: page === currentPage }]"
      >
        {{ page }}
      </button>
      
      <button 
        @click="$emit('change-page', currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        Вперёд →
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  emits: ['change-page'],
  computed: {
    visiblePages() {
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      let pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-top: 1px solid #e5e7eb;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.page-btn {
  padding: 8px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.page-btn.active {
  background: #4f46e5;
  color: #ffffff;
  border-color: #4f46e5;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .pagination {
    flex-direction: column;
    gap: 16px;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .page-btn {
    padding: 6px 10px;
    font-size: 0.75rem;
  }
}
</style>