<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-text">Мой Кабинет</span>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <div 
        v-for="item in menuItems" 
        :key="item.key"
        :class="['nav-item', { active: activeMenu === item.key }]"
        @click="$emit('menu-change', item.key)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-text">{{ item.label }}</span>
      </div>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'UserSidebar',
  props: {
    activeMenu: {
      type: String,
      default: 'organization'
    }
  },
  emits: ['menu-change'],
  data() {
    return {
      menuItems: [
        { key: 'organization', label: 'Организация', icon: '🏢' },
        { key: 'statistics', label: 'Статистика', icon: '📊' }
      ]
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 700;
}

.logo-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  margin: 4px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #94a3b8;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.nav-icon {
  font-size: 1.25rem;
  width: 24px;
}

.nav-text {
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }
  
  .logo-text,
  .nav-text {
    display: none;
  }
  
  .nav-item {
    justify-content: center;
    padding: 12px;
  }
  
  .nav-icon {
    font-size: 1.5rem;
    width: auto;
  }
}
</style>