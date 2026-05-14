<template>
  <div>
    <h2 class="auth-title">Вход</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <input 
          type="email" 
          v-model="loginData.email" 
          placeholder="Email адрес" 
          class="form-input"
          @input="clearError('email')"
        >
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <input 
          type="password" 
          v-model="loginData.password"
          placeholder="Пароль" 
          class="form-input"
          @input="clearError('password')"
        >
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <button 
        type="submit"
        class="btn btn-success"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Вход...' : 'Войти' }}
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

const loginData = reactive({
  email: '',
  password: ''
});

const errors = reactive({});

const validate = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
  let isValid = true;
  
  if (!loginData.email.trim()) {
    errors.email = 'Введите email';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
    errors.email = 'Введите корректный email';
    isValid = false;
  }
  if (!loginData.password) {
    errors.password = 'Введите пароль';
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
    const data = await api.login({
      email: loginData.email,
      password: loginData.password
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
    if (err.message.includes('Неверный email')) {
      errors.email = 'Неверный email или пароль';
    } else {
      console.error(err);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>