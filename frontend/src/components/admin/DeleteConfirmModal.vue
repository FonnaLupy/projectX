<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal">
      <h3 class="modal-title">⚠️ Подтверждение удаления</h3>
      <div class="modal-content">
        <p>
          Вы уверены, что хотите удалить пользователя 
          <strong>{{ user?.name }}</strong>?
        </p>
        <p class="warning-text">
          Это действие нельзя отменить. Все данные пользователя будут безвозвратно удалены.
        </p>
      </div>
      <div class="modal-actions">
        <button @click="$emit('cancel')" class="btn btn-secondary">
          Отмена
        </button>
        <button @click="$emit('confirm')" class="btn btn-danger">
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    default: null
  }
});

defineEmits(['confirm', 'cancel']);
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
  max-width: 450px;
  width: 90%;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
}

.modal-content {
  margin-bottom: 24px;
}

.modal-content p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 12px;
}

.modal-content strong {
  color: #111827;
}

.warning-text {
  color: #dc2626 !important;
  font-size: 0.875rem;
  margin-top: 12px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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

@media (max-width: 480px) {
  .modal {
    padding: 20px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>