<template>
  <div class="stats-container">
    <div v-if="!hasAccess" class="auth-container">
      <h2>🔒 Доступ запрещён</h2>
      <p>У вас нет прав для просмотра статистики</p>
      <p class="current-role">Ваша роль: {{ currentRole }}</p>
      <router-link to="/auth" class="btn btn-primary">Перейти ко входу</router-link>
    </div>

    <div v-else>
      <StatisticsHeader 
        @refresh="loadStatistics"
        @export="exportReport"
        @logout="logout"
      />
      
      <OverviewCards 
        :total-users="stats.totalUsers"
        :active-users="stats.activeUsers"
        :inactive-users="stats.inactiveUsers"
        :blocked-users="stats.blockedUsers"
        :active-now="activeNow"
        :active-percent="activePercent"
        :average-session-time="averageSessionTime"
        :total-session-time="stats.totalSessionTime"
        :visits-today="stats.visitsToday"
        :total-visits="stats.totalVisits"
        :average-rating="averageRating"
        :max-user-rating="stats.maxRating"
        :min-user-rating="stats.minRating"
        @card-click="showDetail"
      />
      
      <TopUsersTable :users="stats.top10Users || []" />
      
      <StatisticsModal 
        v-if="showModal"
        :type="modalType"
        :title="modalTitle"
        :data="modalData"
        @close="closeModal"
      />
      
      <Toast 
        v-if="toast.show"
        :message="toast.message"
        :type="toast.type"
      />
    </div>
  </div>
</template>

<script>
import StatisticsHeader from '@/components/statistics/StatisticsHeader.vue';
import OverviewCards from '@/components/statistics/OverviewCards.vue';
import TopUsersTable from '@/components/statistics/TopUsersTable.vue';
import StatisticsModal from '@/components/statistics/StatisticsModal.vue';
import Toast from '@/components/common/Toast.vue';

export default {
  name: 'StatisticsPage',
  components: {
    StatisticsHeader,
    OverviewCards,
    TopUsersTable,
    StatisticsModal,
    Toast
  },
  data() {
    return {
      hasAccess: false,
      currentRole: '',
      showModal: false,
      modalType: '',
      modalTitle: '',
      toast: {
        show: false,
        message: '',
        type: 'success'
      },
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        blockedUsers: 0,
        totalVisits: 0,
        totalSessionTime: 0,
        avgRating: 0,
        maxRating: 0,
        minRating: 0,
        maxSessionTime: 0,
        minSessionTime: 0,
        visitsToday: 0,
        top10Users: []
      }
    }
  },
  computed: {
    activeNow() {
      return this.stats.activeNow || 0;
    },
    activePercent() {
      return this.stats.totalUsers ? Math.round((this.stats.activeUsers / this.stats.totalUsers) * 100) : 0;
    },
    averageSessionTime() {
      if (this.stats.totalUsers === 0) return '0ч 0м';
      const avgSec = Math.floor(this.stats.totalSessionTime / this.stats.totalUsers);
      const hrs = Math.floor(avgSec / 3600);
      const mins = Math.floor((avgSec % 3600) / 60);
      return `${hrs}ч ${mins}м`;
    },
    averageRating() {
      return this.stats.avgRating ? this.stats.avgRating.toFixed(1) : '0';
    },
    modalData() {
      return {
        totalUsers: this.stats.totalUsers,
        activeUsers: this.stats.activeUsers,
        inactiveUsers: this.stats.inactiveUsers,
        blockedUsers: this.stats.blockedUsers,
        activeNow: this.activeNow,
        activePercent: this.activePercent,
        averageSessionTime: this.averageSessionTime,
        totalSessionTime: this.stats.totalSessionTime,
        maxSessionTime: this.stats.maxSessionTime,
        minSessionTime: this.stats.minSessionTime,
        visitsToday: this.stats.visitsToday,
        totalVisits: this.stats.totalVisits,
        averageVisits: this.stats.totalUsers ? Math.floor(this.stats.totalVisits / this.stats.totalUsers) : 0,
        averageRating: this.averageRating,
        maxUserRating: this.stats.maxRating,
        minUserRating: this.stats.minRating
      };
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
      
      console.log('Token:', token);
      console.log('User string:', userStr);
      
      if (!token) {
        console.log('Нет токена, перенаправление на /auth');
        this.$router.push('/auth');
        return;
      }
      
      if (!userStr) {
        console.log('Нет данных пользователя, перенаправление на /auth');
        this.$router.push('/auth');
        return;
      }
      
      try {
        const user = JSON.parse(userStr);
        console.log('User object:', user);
        console.log('User role:', user.role);
        
        this.currentRole = user.role;
        
        // Проверяем, имеет ли пользователь доступ к статистике
        // Доступ имеют: admin и statistician
        if (user.role === 'admin' || user.role === 'statistician') {
          console.log('Доступ разрешён');
          this.hasAccess = true;
          this.loadStatistics();
        } else {
          console.log('Доступ запрещён, роль:', user.role);
          this.hasAccess = false;
        }
      } catch (err) {
        console.error('Ошибка парсинга пользователя:', err);
        this.$router.push('/auth');
      }
    },
    
    async loadStatistics() {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        const response = await fetch('/api/statistics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.stats = {
            totalUsers: data.totalUsers || 0,
            activeUsers: data.activeUsers || 0,
            inactiveUsers: data.inactiveUsers || 0,
            blockedUsers: data.blockedUsers || 0,
            totalVisits: data.totalVisits || 0,
            totalSessionTime: data.totalSessionTime || 0,
            avgRating: data.avgRating || 0,
            maxRating: data.maxRating || 0,
            minRating: data.minRating || 0,
            maxSessionTime: data.maxSessionTime || 0,
            minSessionTime: data.minSessionTime || 0,
            visitsToday: data.visitsToday || 0,
            activeNow: data.activeNow || 0,
            top10Users: data.top10Users || []
          };
        } else {
          this.loadMockStatistics();
        }
      } catch (err) {
        console.error('Ошибка загрузки статистики:', err);
        this.loadMockStatistics();
      }
    },
    
    showDetail(type) {
      this.modalType = type;
      switch (type) {
        case 'total':
          this.modalTitle = 'Общая статистика пользователей';
          break;
        case 'activeNow':
          this.modalTitle = 'Активные пользователи';
          break;
        case 'averageTime':
          this.modalTitle = 'Время на сайте';
          break;
        case 'visits':
          this.modalTitle = 'Статистика визитов';
          break;
        case 'rating':
          this.modalTitle = 'Рейтинг пользователей';
          break;
        default:
          this.modalTitle = 'Детали';
      }
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
    },
    
    refreshData() {
      this.loadStatistics();
    },
    
    exportReport() {
      const report = {
        exportDate: new Date().toISOString(),
        statistics: { ...this.stats }
      };
      
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `statistics-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('Отчёт экспортирован', 'success');
    },
    
    logout() {
      if (confirm('Выйти из системы?')) {
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
.stats-container {
  max-width: 1400px;
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
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.auth-container h2 {
  margin-bottom: 20px;
  color: #dc2626;
}

.auth-container p {
  margin: 20px 0;
  color: #6b7280;
}

.current-role {
  background: #f3f4f6;
  padding: 10px;
  border-radius: 8px;
  font-family: monospace;
}

.btn-primary {
  background-color: #4f46e5;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover {
  background-color: #4338ca;
}
</style>