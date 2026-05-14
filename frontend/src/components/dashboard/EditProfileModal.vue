<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h3 class="modal-title">Редактировать профиль</h3>
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label class="form-label">Имя</label>
          <input 
            v-model="formData.name" 
            type="text" 
            class="form-input" 
            required
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">Email</label>
          <input 
            v-model="formData.email" 
            type="email" 
            class="form-input" 
            required
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">Телефон</label>
          <input 
            v-model="formData.phone" 
            type="tel" 
            class="form-input" 
            placeholder="+7 (999) 000-00-00"
          >
        </div>
        
        <div class="modal-actions">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Отмена
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save']);

const formData = reactive({
  name: '',
  email: '',
  phone: ''
});

watch(() => props.user, (newUser) => {
  if (newUser) {
    formData.name = newUser.name || '';
    formData.email = newUser.email || '';
    formData.phone = newUser.phone || '';
  }
}, { immediate: true, deep: true });

const handleSubmit = () => {
  emit('save', { ...formData });
};
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

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.modal-actions .btn {
  flex: 1;
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

.btn-primary {
  background-color: #4f46e5;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>