<template>
  <div :class="['toast', type]">
    <span class="toast-icon">
      {{ type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️' }}
    </span>
    <span class="toast-message">{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning'].includes(value)
  }
});
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 16px 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1001;
  animation: slideInRight 0.3s ease;
  min-width: 300px;
}

.toast.success {
  border-left: 4px solid #22c55e;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast.warning {
  border-left: 4px solid #f59e0b;
}

.toast-icon {
  font-size: 1.25rem;
}

.toast-message {
  font-size: 0.875rem;
  color: #1f2937;
  flex: 1;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 480px) {
  .toast {
    left: 20px;
    right: 20px;
    min-width: auto;
  }
}
</style>