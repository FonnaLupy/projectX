<template>
  <div>
    <h2 class="auth-title">Регистрация</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <input 
          type="text" 
          v-model="formData.lastName"
          placeholder="Фамилия" 
          class="form-input"
          @input="clearError('lastName')"
        >
        <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
      </div>

      <div class="form-group">
        <input 
          type="text" 
          v-model="formData.name"
          placeholder="Имя" 
          class="form-input"
          @input="clearError('name')"
        >
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <input 
          type="email" 
          v-model="formData.email" 
          placeholder="Email адрес" 
          class="form-input"
          @input="clearError('email')"
        >
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <input 
          type="password" 
          v-model="formData.password"
          placeholder="Пароль (мин. 6 символов)" 
          class="form-input"
          @input="clearError('password')"
        >
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <div class="form-group">
        <input 
          type="password" 
          v-model="formData.confirmPassword" 
          placeholder="Подтвердите пароль" 
          class="form-input"
          @input="clearError('confirmPassword')"
        >
        <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
      </div>

      <button 
        type="submit"
        class="btn btn-primary"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import { useAuth } from '@/stores/auth';

const router = useRouter();
const auth = useAuth();
const isLoading = ref(false);

const formData = reactive({
  lastName: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive({});

const validate = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
  let isValid = true;
  
  if (!formData.lastName.trim()) {
    errors.lastName = 'Введите фамилию';
    isValid = false;
  }
  if (!formData.name.trim()) {
    errors.name = 'Введите имя';
    isValid = false;
  }
  if (!formData.email.trim()) {
    errors.email = 'Введите email';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Введите корректный email';
    isValid = false;
  }
  if (!formData.password) {
    errors.password = 'Введите пароль';
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов';
    isValid = false;
  }
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
    isValid = false;
  }
  
  return isValid;
};

const clearError = (field) => {
  delete errors[field];
};

const handleSubmit = async () => {
  if (!validate()) return;
  isLoading.value = true;

  try {
    const data = await api.register({
      lastName: formData.lastName,
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    auth.setAuth(data.token, data.user);
    
    // Перенаправление в зависимости от роли
    if (data.user.role === 'admin') {
      router.push('/admin');
    } else if (data.user.role === 'statistician') {
      router.push('/statistics');
    } else {
      router.push('/dashboard');
    }
  } catch (err) {
    if (err.message.includes('Email уже используется')) {
      errors.email = 'Пользователь с таким email уже существует';
    } else {
      console.error(err);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>