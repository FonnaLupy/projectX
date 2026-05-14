<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Вход' : 'Регистрация' }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <input 
          v-model="form.email"
          type="email"
          placeholder="Email"
          required
        >
      </div>
      
      <div class="form-group">
        <input 
          v-model="form.password"
          type="password"
          placeholder="Пароль"
          required
        >
      </div>
      
      <div v-if="!isLogin" class="form-group">
        <input 
          v-model="form.lastName"
          type="text"
          placeholder="Фамилия"
          required
        >
      </div>

      <div v-if="!isLogin" class="form-group">
        <input 
          v-model="form.name"
          type="text"
          placeholder="Имя"
          required
        >
      </div>
      
      <button type="submit">
        {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
      </button>
    </form>
    
    <p>
      <a href="#" @click.prevent="toggleForm">
        {{ isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт?' }}
      </a>
    </p>
    
    <div class="demo-accounts">
      <p>Демо-аккаунты:</p>
      <div class="demo-buttons">
        <button @click="loginAsUser" class="demo-btn user">
          👤 Пользователь
        </button>
        <button @click="loginAsExpert" class="demo-btn expert">
          🧪 Эксперт
        </button>
        <button @click="loginAsAdmin" class="demo-btn admin">
          👨‍💼 Админ
        </button>
        <button @click="loginAsStatistician" class="demo-btn stat">
          📊 Статистик
        </button>
      </div>
    </div>
    
    <!-- Модальное окно для сообщения о неверифицированном аккаунте -->
    <div v-if="showVerificationModal" class="modal-overlay" @click.self="closeVerificationModal">
      <div class="modal">
        <div class="modal-icon">⏳</div>
        <h3 class="modal-title">Аккаунт не подтверждён</h3>
        <div class="modal-content">
          <p>
            Уважаемый(ая) <strong>{{ pendingUser?.name }}</strong>!
          </p>
          <p>
            Ваш аккаунт ещё не прошёл верификацию администратором.
          </p>
          <p class="warning-text">
            Пожалуйста, дождитесь подтверждения. После верификации вы получите доступ к сайту.
          </p>
          <div class="user-info-modal">
            <div><strong>Email:</strong> {{ pendingUser?.email }}</div>
            <div><strong>Роль:</strong> {{ getRoleTextMethod(pendingUser?.role) }}</div>
            <div><strong>Дата регистрации:</strong> {{ pendingUser?.registerDate }}</div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeVerificationModal" class="btn btn-primary">
            Понятно
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthPage',
  data() {
    return {
      isLogin: true,
      form: {
        email: '',
        password: '',
        lastName: '',
        name: '',
        role: 'user'
      },
      showVerificationModal: false,
      pendingUser: null
    }
  },
  
  methods: {
    getRoleTextMethod(role) {
      const roles = {
        user: 'Пользователь',
        expert: 'Эксперт',
        admin: 'Администратор',
        statistician: 'Статистик'
      };
      return roles[role] || role || 'Пользователь';
    },
    
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.form.email = '';
      this.form.password = '';
      this.form.lastName = '';
      this.form.name = '';
      this.form.role = 'user';
    },
    
    closeVerificationModal() {
      this.showVerificationModal = false;
      this.pendingUser = null;
    },
    
    // Быстрый вход с демо-аккаунтами
    loginAsUser() {
      this.form.email = 'user@example.com';
      this.form.password = '123456';
      this.handleSubmit();
    },
    
    loginAsExpert() {
      this.form.email = 'expert@example.com';
      this.form.password = '123456';
      this.handleSubmit();
    },
    
    loginAsAdmin() {
      this.form.email = 'admin@example.com';
      this.form.password = 'admin123';
      this.handleSubmit();
    },
    
    loginAsStatistician() {
      this.form.email = 'stat@example.com';
      this.form.password = 'stat123';
      this.handleSubmit();
    },
    
    setUserAndRedirect(user, token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Установлен пользователь:', user);
      console.log('Роль пользователя:', user.role);
      
      if (user.role === 'admin') {
        this.$router.push('/admin');
      } else if (user.role === 'statistician') {
        this.$router.push('/statistics');
      } else if (user.role === 'expert') {
        this.$router.push('/expert');
      } else {
        this.$router.push('/dashboard');
      }
    },
    
    async handleSubmit() {
      if (this.isLogin) {
        await this.loginUser();
      } else {
        await this.registerUser();
      }
    },
    
    async loginUser() {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.form.email,
            password: this.form.password
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          if (response.status === 403) {
            if (data.code === 'ACCOUNT_NOT_VERIFIED') {
              this.pendingUser = {
                name: this.form.email,
                email: this.form.email,
                role: 'user',
                registerDate: new Date().toLocaleDateString('ru-RU')
              };
              this.showVerificationModal = true;
              return;
            }
            if (data.code === 'ACCOUNT_BLOCKED') {
              alert('Ваша учётная запись заблокирована. Обратитесь к администратору.');
              return;
            }
          }
          throw new Error(data.error || 'Ошибка входа');
        }
        
        this.setUserAndRedirect(data.user, data.token);
        
      } catch (err) {
        console.error('Ошибка входа:', err);
        alert(err.message || 'Неверный email или пароль');
      }
    },
    
    async registerUser() {
      if (!this.form.name || !this.form.email || !this.form.password) {
        alert('Заполните все поля');
        return;
      }
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              lastName: this.form.lastName,
              name: this.form.name,
              email: this.form.email,
              password: this.form.password
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка регистрации');
        }
        
        alert('Регистрация успешна! Ваш аккаунт ожидает верификации администратором.');
        
        this.isLogin = true;
        this.form.email = '';
        this.form.password = '';
        this.form.name = '';
        this.form.role = 'user';
        
      } catch (err) {
        console.error('Ошибка регистрации:', err);
        alert(err.message);
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 100px auto;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button[type="submit"]:hover {
  background-color: #7c3aed;
}

p {
  text-align: center;
  margin-top: 20px;
}

a {
  color: #8b5cf6;
  text-decoration: none;
  cursor: pointer;
}

a:hover {
  text-decoration: underline;
}

.demo-accounts {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.demo-accounts p {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 10px;
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.demo-btn {
  padding: 8px 16px;
  font-size: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-btn.user {
  background-color: #3b82f6;
  color: white;
}

.demo-btn.expert {
  background-color: #8b5cf6;
  color: white;
}

.demo-btn.admin {
  background-color: #dc2626;
  color: white;
}

.demo-btn.stat {
  background-color: #10b981;
  color: white;
}

.demo-btn:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

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
  text-align: center;
}

.modal-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 1.5rem;
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
  color: #f59e0b !important;
  font-weight: 500;
  background: #fef3c7;
  padding: 10px;
  border-radius: 8px;
}

.user-info-modal {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  text-align: left;
}

.user-info-modal div {
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.user-info-modal div:last-child {
  margin-bottom: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
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
  background-color: #8b5cf6;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #7c3aed;
}
</style>