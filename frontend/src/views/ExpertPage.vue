<template>
  <div class="expert-container">
    <div v-if="!hasAccess" class="auth-container">
      <h2>🔒 Доступ запрещён</h2>
      <p>У вас нет прав эксперта</p>
      <router-link to="/auth" class="btn btn-primary">Перейти ко входу</router-link>
    </div>

    <div v-else>
      <ExpertHeader 
        @refresh="refreshData"
        @logout="logout"
      />
      
      <ExpertStatsCards 
        :projects-count="stats.projectsCount"
        :expert-rating="stats.expertRating"
        :completed-expertises="stats.completedExpertises"
        :pending-reviews="stats.pendingReviews"
      />
      
      <div class="welcome-card">
        <div class="welcome-icon">🧪</div>
        <h2>Вы вошли как эксперт</h2>
        <p>Добро пожаловать в экспертную панель, {{ user.name }}!</p>
      </div>
      
      <Toast 
        v-if="toast.show"
        :message="toast.message"
        :type="toast.type"
      />
    </div>
  </div>
</template>

<script>
import ExpertHeader from '@/components/expert/ExpertHeader.vue';
import ExpertStatsCards from '@/components/expert/ExpertStatsCards.vue';
import Toast from '@/components/common/Toast.vue';

export default {
  name: 'ExpertPage',
  components: {
    ExpertHeader,
    ExpertStatsCards,
    Toast
  },
  data() {
    return {
      hasAccess: false,
      user: {
        id: null,
        name: '',
        email: '',
        role: '',
        expertise: ''
      },
      stats: {
        projectsCount: 0,
        expertRating: 0,
        completedExpertises: 0,
        pendingReviews: 0
      },
      tasks: [],
      achievements: [],
      toast: {
        show: false,
        message: '',
        type: 'success'
      }
    }
  },
  methods: {
    showToast(message, type) {
      this.toast = { show: true, message, type };
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },
    
    checkAccess() {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        this.$router.push('/auth');
        return;
      }
      
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'expert') {
          this.hasAccess = true;
          this.user = user;
          this.loadExpertData();
        } else {
          this.$router.push('/dashboard');
        }
      } catch (err) {
        this.$router.push('/auth');
      }
    },
    
    loadExpertData() {
      // Загружаем данные эксперта (имитация API)
      this.stats = {
        projectsCount: 12,
        expertRating: 98,
        completedExpertises: 45,
        pendingReviews: 3
      };
      
    },
    
    refreshData() {
      this.loadExpertData();
      this.showToast('Данные обновлены', 'success');
    },
    
    logout() {
      if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.$router.push('/auth');
      }
    }
  },
  mounted() {
    this.checkAccess();
  }
}
</script>

<style scoped>
.expert-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

.auth-container {
  max-width: 400px;
  margin: 100px auto;
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
}

.auth-container p {
  margin: 20px 0;
  color: #6b7280;
}

.btn {
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
}

.btn-primary {
  background-color: #8b5cf6;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #7c3aed;
}

.welcome-card {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: white;
  margin-bottom: 24px;
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.welcome-card h2 {
  font-size: 1.875rem;
  margin-bottom: 12px;
}

.welcome-card p {
  font-size: 1rem;
  opacity: 0.95;
}

.expert-info {
  margin-top: 12px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  font-size: 1.25rem;
  margin-bottom: 16px;
  color: #111827;
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-card li:last-child {
  border-bottom: none;
}

.info-card li span {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.info-card li span.completed {
  background: #dcfce7;
  color: #166534;
}

.info-card li span.in-progress {
  background: #dbeafe;
  color: #1e40af;
}

.info-card li span.pending {
  background: #fed7aa;
  color: #9a3412;
}

.achievements {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.achievement {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.achievement-icon {
  font-size: 2rem;
}

.achievement-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.achievement-desc {
  font-size: 0.75rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-card h2 {
    font-size: 1.5rem;
  }
}
</style>