<template>
  <div class="dashboard-layout">
    <UserSidebar :active-menu="activeMenu" @menu-change="changeMenu" />
    
    <main class="dashboard-main">
      <div class="dashboard-header">
        <div class="user-info">
          <div class="user-avatar">{{ userInitials }}</div>
          <div>
            <h2>{{ user.name }}</h2>
            <p class="user-role">{{ getRoleText(user.role) }}</p>
          </div>
        </div>
        <button @click="logout" class="btn-logout">
          🚪 Выйти
        </button>
      </div>
      
      <div class="dashboard-content">
        <transition name="fade" mode="out-in">
          <OrganizationForm 
            v-if="activeMenu === 'organization'"
            :key="'org-' + organizationData"
            :initial-data="organizationData"
            @save="saveOrganization"
          />
          
          <StatisticsPlaceholder 
            v-else
            :visits="user.visits || 0"
            :time-on-site="formatTime(sessionTime)"
            :has-organization="hasOrganization"
          />
        </transition>
      </div>
    </main>
  </div>
</template>

<script>
import UserSidebar from '@/components/dashboard/UserSidebar.vue';
import OrganizationForm from '@/components/dashboard/OrganizationForm.vue';
import StatisticsPlaceholder from '@/components/dashboard/StatisticsPlaceholder.vue';

export default {
  name: 'DashboardPage',
  components: {
    UserSidebar,
    OrganizationForm,
    StatisticsPlaceholder
  },
  data() {
    return {
      activeMenu: 'organization',
      sessionTime: 0,
      timerInterval: null,
      user: {
        id: null,
        name: '',
        email: '',
        role: 'user',
        status: '',
        isVerified: false,
        visits: 0
      },
      organizationData: {
        fullName: '',
        shortName: '',
        inn: '',
        ogrn: '',
        kpp: '',
        email: '',
        phone: '',
        website: '',
        address: ''
      }
    }
  },
  computed: {
    userInitials() {
      const name = this.user.name || '';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },
    hasOrganization() {
      return !!(this.organizationData.fullName && this.organizationData.fullName.trim());
    }
  },
  methods: {
    getRoleText(role) {
      const roles = {
        user: 'Пользователь',
        expert: 'Эксперт',
        admin: 'Администратор',
        statistician: 'Статистик'
      };
      return roles[role] || role || 'Пользователь';
    },
    
    formatTime(seconds) {
      if (!seconds && seconds !== 0) return '00:00:00';
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    changeMenu(menu) {
      this.activeMenu = menu;
    },
    
    startTimer() {
      // Загружаем сохранённое время из localStorage
      const saved = localStorage.getItem(`sessionTime_${this.user.id}`);
      if (saved) {
        this.sessionTime = parseInt(saved) || 0;
      }
      
      this.timerInterval = setInterval(() => {
        this.sessionTime++;
        // Сохраняем в localStorage каждую секунду
        localStorage.setItem(`sessionTime_${this.user.id}`, this.sessionTime);
        
        // Каждые 30 секунд отправляем на сервер
        if (this.sessionTime % 30 === 0) {
            this.saveSessionTime();
        }
      }, 1000);
    },

    async saveSessionTime() {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        await fetch('/api/session/time', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ sessionTime: this.sessionTime })
        });
      } catch (err) {
        // Тихо игнорируем ошибки
      }
    },
    
    async loadUserData() {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
        } catch (e) {}
      }
      
      // Загружаем данные организации через API
      const token = localStorage.getItem('token');
      if (token) {
        try {
            const response = await fetch('/api/user/organization', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
              const org = await response.json();
              if (org && org.full_name_org) {
                this.organizationData = {
                  fullName: org.full_name_org,
                  shortName: org.short_name,
                  inn: org.inn,
                  ogrn: org.ogrn,
                  kpp: org.kpp,
                  email: org.email,
                  phone: org.ib_phone,
                  website: org.website,
                  address: org.address
              };
            }
          }
        } catch (e) {
          console.error('Ошибка загрузки организации:', e);
        }
      }
    },
    
    async saveOrganization(data) {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
          const response = await fetch('/api/user/organization', {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                  full_name_org: data.fullName,
                  short_name: data.shortName,
                  inn: data.inn,
                  ogrn: data.ogrn,
                  kpp: data.kpp,
                  email: data.email,
                  ib_phone: data.phone,
                  website: data.website,
                  address: data.address
              })
          });
          
          if (response.ok) {
              const result = await response.json();
              this.organizationData = {
                  fullName: result.full_name_org,
                  shortName: result.short_name,
                  inn: result.inn,
                  ogrn: result.ogrn,
                  kpp: result.kpp,
                  email: result.email,
                  phone: result.ib_phone,
                  website: result.website,
                  address: result.address
              };
              alert('✅ Данные организации успешно сохранены!');
          } else {
              throw new Error('Ошибка сохранения');
          }
      } catch (error) {
          console.error('Ошибка сохранения:', error);
          alert('❌ Ошибка при сохранении данных');
      }
    },
    
    updateAdminUserList(orgData) {
      const savedUsers = localStorage.getItem('admin_users');
      if (savedUsers) {
        let users = JSON.parse(savedUsers);
        const userIndex = users.findIndex(u => u.id === this.user.id);
        
        if (userIndex !== -1) {
          users[userIndex] = {
            ...users[userIndex],
            organization: {
              fullName: orgData.fullName,
              shortName: orgData.shortName,
              inn: orgData.inn,
              ogrn: orgData.ogrn,
              kpp: orgData.kpp,
              email: orgData.email,
              phone: orgData.phone,
              website: orgData.website,
              address: orgData.address,
              hasOrganization: true
            }
          };
          localStorage.setItem('admin_users', JSON.stringify(users));
        }
      }
    },
    
    logout() {
      if (confirm('Вы уверены, что хотите выйти?')) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        // Последний раз сохраняем время
        localStorage.setItem(`sessionTime_${this.user.id}`, this.sessionTime);
        this.saveSessionTime();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.$router.push('/auth');
      }
    }
  },
  mounted() {
    this.loadUserData();
    this.startTimer();
  },
  beforeUnmount() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
}

.dashboard-main {
  flex: 1;
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  background: white;
  padding: 20px 32px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
}

.user-info h2 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 4px;
}

.user-role {
  font-size: 0.75rem;
  color: #64748b;
}

.btn-logout {
  padding: 8px 20px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
}

.dashboard-content {
  flex: 1;
  padding: 24px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }
  
  .dashboard-header {
    padding: 16px;
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .user-info {
    flex-direction: column;
  }
  
  .dashboard-content {
    padding: 16px;
  }
}
</style>