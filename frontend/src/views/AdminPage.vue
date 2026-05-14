<template>
  <div class="admin-container">
    <div v-if="!hasAccess" class="auth-container">
      <h2>🔒 Доступ запрещён</h2>
      <p>У вас нет прав администратора</p>
      <router-link to="/auth" class="btn btn-primary">Перейти ко входу</router-link>
    </div>

    <div v-else>
      <AdminHeader 
        @refresh="loadUsers" 
        @export="exportData"
        @logout="logout" 
      />
      
      <StatsCards 
        :total-users="users.length"
        :active-users="activeUsers"
        :average-time="averageTime"
        :new-users-this-week="newUsersThisWeek"
      />
      
      <!-- Фильтры -->
      <div class="filters-bar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Поиск по имени или email..." 
            class="search-input"
          >
        </div>
        
        <select v-model="statusFilter" class="filter-select">
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
          <option value="blocked">Заблокированные</option>
        </select>
        
        <select v-model="roleFilter" class="filter-select">
          <option value="all">Все роли</option>
          <option value="user">👤 Пользователи</option>
          <option value="expert">🧪 Эксперты</option>
          <option value="statistician">📊 Статистики</option>
          <option value="admin">👨‍💼 Администраторы</option>
        </select>
        
        <select v-model="verificationFilter" class="filter-select">
          <option value="all">Все пользователи</option>
          <option value="verified">Верифицированные</option>
          <option value="unverified">Неверифицированные</option>
        </select>
        
        <select v-model="orgFilter" class="filter-select">
          <option value="all">Все организации</option>
          <option value="filled">С заполненной анкетой</option>
          <option value="not_filled">Без анкеты</option>
        </select>
        
        <select v-model="sortBy" class="filter-select">
          <option value="date">По дате регистрации</option>
          <option value="name">По имени</option>
          <option value="time">По времени на сайте</option>
          <option value="visits">По количеству визитов</option>
        </select>
        
        <button @click="clearFilters" class="btn btn-secondary btn-sm">
          🧹 Сбросить
        </button>
      </div>
      
      <!-- Таблица пользователей -->
      <div class="table-container">
        <div class="table-header">
          <h2>📋 Список пользователей</h2>
          <div class="header-stats">
            <span class="user-count">
              Показано {{ filteredUsers.length }} из {{ users.length }}
            </span>
            <span v-if="unverifiedCount > 0" class="unverified-badge">
              ⚠️ {{ unverifiedCount }} требуют верификации
            </span>
            <span v-if="orgNotFilledCount > 0" class="org-badge">
              📋 {{ orgNotFilledCount }} не заполнили анкету
            </span>
          </div>
        </div>
        
        <div class="table-wrapper">
          <table v-if="filteredUsers.length > 0">
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Статус</th>
                <th>Верификация</th>
                <th>Организация</th>
                <th>Время на сайте</th>
                <th>Визиты</th>
                <th>Дата регистрации</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.id" :class="{ 'unverified-row': !user.isVerified }">
                <td class="user-cell">
                  <div class="user-avatar">
                    {{ getUserInitials(user) }}
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ user.name }}</span>
                    <span class="user-email">ID: {{ user.id }}</span>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td class="role-cell">
                  <span :class="['role-badge', getRoleClass(user.role)]">
                    {{ getRoleText(user.role) }}
                  </span>
                  <button 
                    @click="openRoleModal(user)" 
                    class="btn btn-edit-role btn-sm"
                    title="Изменить роль"
                    :disabled="user.id === currentAdminId"
                  >
                    🔄
                  </button>
                </td>
                <td>
                  <span :class="['status-badge', getStatusClass(user.status)]">
                    {{ getStatusText(user.status) }}
                  </span>
                </td>
                <td>
                  <div class="verification-cell">
                    <div v-if="user.isVerified" class="verified-status">
                      <span class="verified-badge">✅ Верифицирован</span>
                    </div>
                    <div v-else class="unverified-status">
                      <span class="unverified-badge-small">⏳ Не верифицирован</span>
                      <button 
                        @click="openVerifyModal(user)" 
                        class="btn btn-success btn-sm"
                        title="Подтвердить пользователя"
                      >
                        ✅ Подтвердить
                      </button>
                    </div>
                  </div>
                </td>
                <td class="org-cell">
                  <div v-if="user.organization && user.organization.hasOrganization" class="org-status">
                    <span class="status-badge success">✅ Заполнена</span>
                    <div class="org-name">{{ user.organization.shortName || user.organization.fullName }}</div>
                    <button @click="viewOrganization(user)" class="btn-view-org">📋 Подробнее</button>
                  </div>
                  <div v-else class="org-status">
                    <span class="status-badge warning">⏳ Не заполнена</span>
                  </div>
                </td>
                <td>{{ formatTime(user.sessionTime) }}</td>
                <td>{{ user.visits }}</td>
                <td>{{ user.registerDate }}</td>
                <td class="actions-cell">
                  <button @click="viewUser(user)" class="btn btn-secondary btn-sm" title="Просмотр">
                    👁️
                  </button>
                  <button 
                    v-if="!user.isVerified" 
                    @click="openVerifyModal(user)" 
                    class="btn btn-success btn-sm" 
                    title="Верифицировать"
                  >
                    ✅
                  </button>
                  <button 
                    @click="toggleUserStatus(user)" 
                    class="btn btn-primary btn-sm" 
                    :title="user.status === 'active' ? 'Заблокировать' : 'Активировать'"
                    :disabled="!user.isVerified && user.status !== 'active'"
                  >
                    {{ user.status === 'active' ? '🚫' : '✅' }}
                  </button>
                  <button 
                    @click="confirmDelete(user)" 
                    class="btn btn-danger btn-sm" 
                    title="Удалить"
                    :disabled="user.id === currentAdminId"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-else class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <h3>Пользователи не найдены</h3>
            <p>Попробуйте изменить параметры поиска или фильтры</p>
          </div>
        </div>

        <Pagination 
          :current-page="currentPage"
          :total-pages="totalPages"
          @change-page="changePage"
        />
      </div>
      
      <!-- Модальное окно изменения роли -->
      <div v-if="showRoleModal" class="modal-overlay" @click.self="closeRoleModal">
        <div class="modal">
          <div class="modal-icon">👔</div>
          <h3 class="modal-title">Изменение роли пользователя</h3>
          <div class="modal-content">
            <div class="user-info-modal">
              <div><strong>Пользователь:</strong> {{ userToChangeRole?.name }}</div>
              <div><strong>Email:</strong> {{ userToChangeRole?.email }}</div>
              <div><strong>Текущая роль:</strong> 
                <span :class="['role-badge', getRoleClass(userToChangeRole?.role)]">
                  {{ getRoleText(userToChangeRole?.role) }}
                </span>
              </div>
            </div>
            
            <div class="form-group-modal">
              <label class="form-label">Выберите новую роль:</label>
              <select v-model="selectedRole" class="role-select">
                <option value="user">👤 Пользователь</option>
                <option value="expert">🧪 Эксперт</option>
                <option value="statistician">📊 Статистик</option>
                <option value="admin">👨‍💼 Администратор</option>
              </select>
            </div>
            
            <div v-if="selectedRole === 'admin'" class="warning-box">
              ⚠️ Внимание: Назначение роли администратора дает пользователю полный доступ к системе!
            </div>
            
            <div v-if="userToChangeRole?.role === 'admin' && selectedRole !== 'admin'" class="warning-box warning">
              ⚠️ Вы собираетесь лишить пользователя прав администратора!
            </div>
          </div>
          <div class="modal-actions">
            <button @click="closeRoleModal" class="btn btn-secondary">
              Отмена
            </button>
            <button @click="confirmRoleChange" class="btn btn-primary">
              💾 Сохранить изменения
            </button>
          </div>
        </div>
      </div>
      
      <!-- Модальное окно подтверждения верификации -->
      <div v-if="showVerifyModal" class="modal-overlay" @click.self="closeVerifyModal">
        <div class="modal">
          <div class="modal-icon">✅</div>
          <h3 class="modal-title">Подтверждение верификации</h3>
          <div class="modal-content">
            <p>
              Вы уверены, что хотите верифицировать пользователя 
              <strong>{{ userToVerify?.name }}</strong>?
            </p>
            <p class="success-text">
              После верификации пользователь получит полный доступ к сайту.
            </p>
            <div class="user-details">
              <div><strong>Email:</strong> {{ userToVerify?.email }}</div>
              <div><strong>Роль:</strong> {{ getRoleText(userToVerify?.role) }}</div>
              <div><strong>Дата регистрации:</strong> {{ userToVerify?.registerDate }}</div>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="closeVerifyModal" class="btn btn-secondary">
              Отмена
            </button>
            <button @click="confirmVerify" class="btn btn-success">
              ✅ Подтвердить
            </button>
          </div>
        </div>
      </div>
      
      <!-- Модальное окно просмотра пользователя -->
      <div v-if="showViewModal" class="modal-overlay" @click.self="closeViewModal">
        <div class="modal modal-large">
          <h3 class="modal-title">👤 Информация о пользователе</h3>
          <div class="modal-content">
            <div class="info-grid-modal">
              <div class="info-item">
                <span class="info-label">Имя:</span>
                <span class="info-value">{{ selectedUser?.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ selectedUser?.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Роль:</span>
                <span class="info-value">
                  <span :class="['role-badge', getRoleClass(selectedUser?.role)]">
                    {{ getRoleText(selectedUser?.role) }}
                  </span>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Статус:</span>
                <span class="info-value">{{ getStatusText(selectedUser?.status) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Верификация:</span>
                <span class="info-value">
                  <span v-if="selectedUser?.isVerified" class="verified-badge">Верифицирован</span>
                  <span v-else class="unverified-badge-small">Не верифицирован</span>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Время на сайте:</span>
                <span class="info-value">{{ formatTime(selectedUser?.sessionTime) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Визиты:</span>
                <span class="info-value">{{ selectedUser?.visits }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Дата регистрации:</span>
                <span class="info-value">{{ selectedUser?.registerDate }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ID:</span>
                <span class="info-value">{{ selectedUser?.id }}</span>
              </div>
              <div class="info-item" v-if="selectedUser?.organization">
                <span class="info-label">Организация:</span>
                <span class="info-value">{{ selectedUser?.organization?.shortName || selectedUser?.organization?.fullName || 'Не указана' }}</span>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="closeViewModal" class="btn btn-secondary">
              Закрыть
            </button>
          </div>
        </div>
      </div>
      
      <!-- Модальное окно просмотра данных организации -->
      <div v-if="showOrgModal" class="modal-overlay" @click.self="closeOrgModal">
        <div class="modal modal-large">
          <div class="modal-icon">🏢</div>
          <h3 class="modal-title">Данные организации</h3>
          <div class="modal-content">
            <div class="org-details-grid">
              <div class="detail-row">
                <span class="detail-label">Полное наименование:</span>
                <span class="detail-value">{{ selectedOrgData?.fullName || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Краткое наименование:</span>
                <span class="detail-value">{{ selectedOrgData?.shortName || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ИНН:</span>
                <span class="detail-value">{{ selectedOrgData?.inn || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ОГРН:</span>
                <span class="detail-value">{{ selectedOrgData?.ogrn || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">КПП:</span>
                <span class="detail-value">{{ selectedOrgData?.kpp || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Электронная почта:</span>
                <span class="detail-value">{{ selectedOrgData?.email || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Телефон ответственного:</span>
                <span class="detail-value">{{ selectedOrgData?.phone || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Сайт:</span>
                <span class="detail-value">{{ selectedOrgData?.website || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Адрес:</span>
                <span class="detail-value">{{ selectedOrgData?.address || '-' }}</span>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="closeOrgModal" class="btn btn-secondary">
              Закрыть
            </button>
          </div>
        </div>
      </div>
      
      <!-- Модальное окно подтверждения удаления -->
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal">
          <div class="modal-icon">⚠️</div>
          <h3 class="modal-title">Подтверждение удаления</h3>
          <div class="modal-content">
            <p>
              Вы уверены, что хотите удалить пользователя 
              <strong>{{ userToDelete?.name }}</strong>?
            </p>
            <p class="warning-text">
              Это действие нельзя отменить. Все данные пользователя будут безвозвратно удалены.
            </p>
          </div>
          <div class="modal-actions">
            <button @click="closeDeleteModal" class="btn btn-secondary">
              Отмена
            </button>
            <button @click="deleteUser" class="btn btn-danger">
              Удалить
            </button>
          </div>
        </div>
      </div>
      
      <!-- Уведомление -->
      <div v-if="toast.show" :class="['toast', toast.type]">
        <span class="toast-icon">{{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : '⚠️' }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import AdminHeader from '@/components/admin/AdminHeader.vue';
import StatsCards from '@/components/admin/StatsCards.vue';
import Pagination from '@/components/admin/Pagination.vue';

export default {
  name: 'AdminPage',
  components: {
    AdminHeader,
    StatsCards,
    Pagination
  },
  data() {
    return {
      hasAccess: false,
      users: [],
      searchQuery: '',
      statusFilter: 'all',
      roleFilter: 'all',
      verificationFilter: 'all',
      orgFilter: 'all',
      sortBy: 'date',
      currentPage: 1,
      itemsPerPage: 10,
      showDeleteModal: false,
      showViewModal: false,
      showVerifyModal: false,
      showRoleModal: false,
      showOrgModal: false,
      userToDelete: null,
      userToVerify: null,
      userToChangeRole: null,
      selectedRole: 'user',
      selectedUser: null,
      selectedOrgData: null,
      currentAdminId: null,
      toast: {
        show: false,
        message: '',
        type: 'success'
      }
    }
  },
  computed: {
    activeUsers() {
      return this.users.filter(u => u.status === 'active').length;
    },
    averageTime() {
      if (this.users.length === 0) return '0ч 0м';
      const total = this.users.reduce((sum, u) => sum + (u.sessionTime || 0), 0);
      const avg = Math.floor(total / this.users.length / 60);
      return `${Math.floor(avg / 60)}ч ${avg % 60}м`;
    },
    newUsersThisWeek() {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return this.users.filter(u => new Date(u.registerDate) >= weekAgo).length;
    },
    unverifiedCount() {
      return this.users.filter(u => !u.isVerified).length;
    },
    orgNotFilledCount() {
      return this.users.filter(u => !(u.organization && u.organization.hasOrganization)).length;
    },
    filteredUsers() {
      let result = [...this.users];
      
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        result = result.filter(u => 
          u.name.toLowerCase().includes(q) || 
          u.email.toLowerCase().includes(q)
        );
      }
      
      if (this.statusFilter !== 'all') {
        result = result.filter(u => u.status === this.statusFilter);
      }
      
      if (this.roleFilter !== 'all') {
        result = result.filter(u => u.role === this.roleFilter);
      }
      
      if (this.verificationFilter === 'verified') {
        result = result.filter(u => u.isVerified === true);
      } else if (this.verificationFilter === 'unverified') {
        result = result.filter(u => u.isVerified === false);
      }
      
      if (this.orgFilter === 'filled') {
        result = result.filter(u => u.organization && u.organization.hasOrganization);
      } else if (this.orgFilter === 'not_filled') {
        result = result.filter(u => !(u.organization && u.organization.hasOrganization));
      }
      
      result.sort((a, b) => {
        if (this.sortBy === 'name') return a.name.localeCompare(b.name);
        if (this.sortBy === 'time') return (b.sessionTime || 0) - (a.sessionTime || 0);
        if (this.sortBy === 'visits') return b.visits - a.visits;
        return new Date(b.registerDate) - new Date(a.registerDate);
      });
      
      return result;
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredUsers.slice(start, start + this.itemsPerPage);
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
    
    getRoleClass(role) {
      const classes = {
        user: 'role-user',
        expert: 'role-expert',
        admin: 'role-admin',
        statistician: 'role-stat'
      };
      return classes[role] || 'role-user';
    },
    
    getUserInitials(user) {
      const name = user.name || '';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },
    
    formatTime(seconds) {
      if (!seconds) return '0ч 0м';
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hrs}ч ${mins}м`;
    },
    
    getStatusClass(status) {
      const classes = {
        active: 'status-active',
        inactive: 'status-inactive',
        blocked: 'status-blocked'
      };
      return classes[status] || 'status-inactive';
    },
    
    getStatusText(status) {
      const texts = {
        active: 'Активен',
        inactive: 'Неактивен',
        blocked: 'Заблокирован'
      };
      return texts[status] || 'Неизвестно';
    },
    
    showToast(message, type) {
      this.toast = { show: true, message, type };
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },
    
    async checkAccess() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/auth');
        return;
      }
      
      try {
        const userStr = localStorage.getItem('user');
        const user = JSON.parse(userStr);
        if (user.role === 'admin') {
          this.hasAccess = true;
          this.currentAdminId = user.id;
          await this.loadUsers();
        } else {
          this.$router.push('/dashboard');
        }
      } catch (err) {
        this.$router.push('/auth');
      }
    },
    
    async loadUsers() {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        const response = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.users = data;
        } else {
          // Если API недоступен, используем мок
          this.loadMockUsers();
        }
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err);
        this.loadMockUsers();
      }
    },
    
    saveUsersToStorage() {
      localStorage.setItem('admin_users', JSON.stringify(this.users));
    },
    
    // Методы для изменения роли
    openRoleModal(user) {
      this.userToChangeRole = user;
      this.selectedRole = user.role;
      this.showRoleModal = true;
    },
    
    closeRoleModal() {
      this.showRoleModal = false;
      this.userToChangeRole = null;
      this.selectedRole = 'user';
    },
    
    async confirmRoleChange() {
      if (!this.userToChangeRole) return;
      
      const oldRole = this.userToChangeRole.role;
      const newRole = this.selectedRole;
      
      if (oldRole === newRole) {
        this.closeRoleModal();
        return;
      }
      
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch(`/api/admin/users/${this.userToChangeRole.id}/role`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ role: newRole })
        });
        
        if (response.ok) {
          const user = this.users.find(u => u.id === this.userToChangeRole.id);
          if (user) {
            user.role = newRole;
            if (newRole === 'admin' && !user.isVerified) {
              user.isVerified = true;
            }
          }
          this.closeRoleModal();
          this.showToast(`Роль изменена на ${this.getRoleText(newRole)}`, 'success');
        } else {
          throw new Error('Ошибка изменения роли');
        }
      } catch (err) {
        console.error('Ошибка:', err);
        this.showToast('Ошибка изменения роли', 'error');
      }
    },
    
    // Методы для верификации
    openVerifyModal(user) {
      this.userToVerify = user;
      this.showVerifyModal = true;
    },
    
    closeVerifyModal() {
      this.showVerifyModal = false;
      this.userToVerify = null;
    },
    
    async confirmVerify() {
      if (!this.userToVerify) return;
      
      const token = localStorage.getItem('token');
      const userName = this.userToVerify.name; // Сохраняем имя до закрытия
      
      try {
        const response = await fetch(`/api/admin/users/${this.userToVerify.id}/verify`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          const user = this.users.find(u => u.id === this.userToVerify.id);
          if (user) {
            user.isVerified = true;
            user.status = 'active';
          }
          this.closeVerifyModal();
          this.showToast(`Пользователь ${userName} верифицирован`, 'success');
        } else {
          throw new Error(data.error || 'Ошибка верификации');
        }
      } catch (err) {
        console.error('Ошибка верификации:', err);
        this.showToast(err.message || 'Ошибка верификации', 'error');
      }
    },
    
    // Методы для работы с организацией
    viewOrganization(user) {
      if (user.organization) {
        this.selectedOrgData = user.organization;
        this.showOrgModal = true;
      }
    },
    
    closeOrgModal() {
      this.showOrgModal = false;
      this.selectedOrgData = null;
    },
    
    // Методы для статуса пользователя
    async toggleUserStatus(user) {
      if (!user.isVerified && user.status !== 'active') {
        this.showToast('Сначала необходимо верифицировать пользователя', 'warning');
        return;
      }
      
      const newStatus = user.status === 'active' ? 'blocked' : 'active';
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch(`/api/admin/users/${user.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
          user.status = newStatus;
          this.showToast(`Статус изменён на ${this.getStatusText(newStatus)}`, 'success');
        } else {
          throw new Error('Ошибка изменения статуса');
        }
      } catch (err) {
        console.error('Ошибка:', err);
        this.showToast('Ошибка изменения статуса', 'error');
      }
    },
    
    // Методы для удаления пользователя
    confirmDelete(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },
    
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.userToDelete = null;
    },
    
    async deleteUser() {
      if (!this.userToDelete) return;
      
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch(`/api/admin/users/${this.userToDelete.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          this.users = this.users.filter(u => u.id !== this.userToDelete.id);
          this.closeDeleteModal();
          this.showToast('Пользователь удалён', 'success');
          if (this.paginatedUsers.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
        } else {
          throw new Error('Ошибка удаления');
        }
      } catch (err) {
        console.error('Ошибка:', err);
        this.showToast('Ошибка удаления', 'error');
      }
    },
    
    // Методы для просмотра
    viewUser(user) {
      this.selectedUser = user;
      this.showViewModal = true;
    },
    
    closeViewModal() {
      this.showViewModal = false;
      this.selectedUser = null;
    },
    
    // Фильтры и пагинация
    clearFilters() {
      this.searchQuery = '';
      this.statusFilter = 'all';
      this.roleFilter = 'all';
      this.verificationFilter = 'all';
      this.orgFilter = 'all';
      this.sortBy = 'date';
      this.currentPage = 1;
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    
    // Экспорт данных
    exportData() {
      const data = {
        exportDate: new Date().toISOString(),
        totalUsers: this.users.length,
        verifiedUsers: this.users.filter(u => u.isVerified).length,
        unverifiedUsers: this.users.filter(u => !u.isVerified).length,
        usersWithOrganization: this.users.filter(u => u.organization && u.organization.hasOrganization).length,
        usersWithoutOrganization: this.users.filter(u => !(u.organization && u.organization.hasOrganization)).length,
        usersByRole: {
          user: this.users.filter(u => u.role === 'user').length,
          expert: this.users.filter(u => u.role === 'expert').length,
          statistician: this.users.filter(u => u.role === 'statistician').length,
          admin: this.users.filter(u => u.role === 'admin').length
        },
        users: this.users
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      this.showToast('Данные экспортированы', 'success');
    },
    
    logout() {
      if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.$router.push('/auth');
      }
    },
    
    loadMockUsers() {
      this.users = [
        { id: 1, name: 'Иван Петров', email: 'user@example.com', role: 'user', status: 'active', sessionTime: 3600, visits: 45, registerDate: '2024-01-15', isVerified: true },
        { id: 2, name: 'Елена Смирнова', email: 'expert@example.com', role: 'expert', status: 'active', sessionTime: 7200, visits: 89, registerDate: '2024-01-10', isVerified: true },
        { id: 3, name: 'Администратор', email: 'admin@example.com', role: 'admin', status: 'active', sessionTime: 15000, visits: 200, registerDate: '2024-01-01', isVerified: true }
      ];
    }
  },
  mounted() {
    this.checkAccess();
  }
}
</script>

<style scoped>
.admin-container {
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

.auth-container p {
  margin: 20px 0;
  color: #6b7280;
}

.btn-primary {
  background-color: #4f46e5;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  display: inline-block;
}

/* Фильтры */
.filters-bar {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 30px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #4f46e5;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.filter-select {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #ffffff;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #4f46e5;
}

/* Таблица */
.table-container {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.table-header {
  padding: 20px 30px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.table-header h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
}

.header-stats {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.user-count {
  color: #6b7280;
  font-size: 0.875rem;
}

.unverified-badge {
  background: #fed7aa;
  color: #9a3412;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.org-badge {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
}

th {
  padding: 14px 20px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #1f2937;
}

tr:hover {
  background: #f9fafb;
}

.unverified-row {
  background: #fffbeb;
}

.unverified-row:hover {
  background: #fef3c7;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #111827;
}

.user-email {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Роли */
.role-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.role-user {
  background: #dbeafe;
  color: #1e40af;
}

.role-expert {
  background: #ede9fe;
  color: #6d28d9;
}

.role-admin {
  background: #fee2e2;
  color: #991b1b;
}

.role-stat {
  background: #d1fae5;
  color: #065f46;
}

.btn-edit-role {
  background-color: #8b5cf6;
  color: white;
  padding: 4px 8px;
  font-size: 0.7rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-edit-role:hover:not(:disabled) {
  background-color: #7c3aed;
}

/* Статус */
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-blocked {
  background: #fef3c7;
  color: #92400e;
}

/* Верификация */
.verification-cell {
  min-width: 180px;
}

.verified-status {
  display: flex;
  align-items: center;
}

.verified-badge {
  background: #dcfce7;
  color: #166534;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.unverified-status {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.unverified-badge-small {
  background: #fed7aa;
  color: #9a3412;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

/* Организация */
.org-cell {
  min-width: 200px;
}

.org-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.org-name {
  font-size: 0.75rem;
  color: #1e293b;
  font-weight: 500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-view-org {
  padding: 4px 8px;
  font-size: 0.7rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #667eea;
  color: white;
}

.btn-view-org:hover {
  background-color: #5a67d8;
}

/* Действия */
.actions-cell {
  display: flex;
  gap: 8px;
  min-width: 120px;
}

.btn {
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #4f46e5;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4338ca;
}

.btn-success {
  background-color: #22c55e;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #16a34a;
}

.btn-danger {
  background-color: #ef4444;
  color: #ffffff;
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.75rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Модальные окна */
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

.modal-large {
  max-width: 650px;
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 16px;
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

.success-text {
  color: #16a34a !important;
  font-weight: 500;
}

.warning-text {
  color: #dc2626 !important;
  font-size: 0.875rem;
}

.user-info-modal {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: left;
}

.user-info-modal div {
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.user-info-modal div:last-child {
  margin-bottom: 0;
}

.form-group-modal {
  text-align: left;
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.role-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #ffffff;
  cursor: pointer;
}

.warning-box {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #92400e;
  margin-top: 12px;
  text-align: left;
}

.warning-box.warning {
  background: #fee2e2;
  border-left-color: #dc2626;
  color: #991b1b;
}

.user-details {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  text-align: left;
}

.user-details div {
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.user-details div:last-child {
  margin-bottom: 0;
}

/* Данные организации */
.org-details-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
}

.detail-row {
  display: flex;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
  gap: 12px;
}

.detail-label {
  width: 200px;
  font-weight: 600;
  color: #475569;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.detail-value {
  flex: 1;
  color: #1e293b;
  font-size: 0.875rem;
  word-break: break-word;
}

/* Информация о пользователе */
.info-grid-modal {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  text-align: left;
  max-height: 500px;
  overflow-y: auto;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
}

.info-value {
  font-size: 0.875rem;
  color: #1f2937;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

/* Уведомления */
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-state-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}

/* Адаптивность */
@media (max-width: 1200px) {
  .info-grid-modal {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .filters-bar {
    flex-direction: column;
  }
  
  .search-box {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .admin-container {
    padding: 10px;
  }
  
  .table-header {
    flex-direction: column;
    text-align: center;
  }
  
  .header-stats {
    flex-direction: column;
    align-items: center;
  }
  
  th, td {
    padding: 12px 10px;
  }
  
  .actions-cell {
    flex-direction: column;
  }
  
  .role-cell {
    flex-direction: column;
  }
  
  .btn-sm {
    width: 100%;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 4px;
  }
  
  .detail-label {
    width: 100%;
  }
  
  .modal-large {
    max-width: 95%;
    padding: 20px;
  }
  
  .toast {
    left: 20px;
    right: 20px;
    min-width: auto;
  }
  
  .org-details-grid {
    max-height: 400px;
  }
}

@media (max-width: 480px) {
  .user-cell {
    min-width: 150px;
  }
  
  .verification-cell {
    min-width: 200px;
  }
  
  .org-cell {
    min-width: 180px;
  }
  
  .unverified-status {
    flex-direction: column;
  }
  
  .org-status {
    align-items: flex-start;
  }
}
</style>