import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/AuthPage.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardPage.vue'),
    meta: { requiresAuth: true, requiresVerification: true, roles: ['user'] }
  },
  {
    path: '/expert',
    name: 'Expert',
    component: () => import('@/views/ExpertPage.vue'),
    meta: { requiresAuth: true, requiresVerification: true, roles: ['expert'] }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminPage.vue'),
    meta: { requiresAuth: true, requiresVerification: true, roles: ['admin'] }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/views/StatisticsPage.vue'),
    meta: { requiresAuth: true, requiresVerification: true, roles: ['admin', 'statistician'] }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Защита маршрутов
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;
  let userRole = null;
  let isVerified = false;
  
  if (userStr) {
    try {
      user = JSON.parse(userStr);
      userRole = user.role;
      isVerified = user.isVerified;
    } catch (e) {}
  }
  
  // Проверка авторизации
  if (to.meta.requiresAuth && !token) {
    next('/auth');
    return;
  }

  if (to.meta.requiresVerification && token && user && !isVerified) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Перенаправляем на страницу входа с сообщением
    alert('❌ Ваш аккаунт ещё не подтверждён администратором. Пожалуйста, дождитесь верификации.');
    next('/auth');
    return;
  }
  
  // Проверка ролей
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    // Перенаправление в зависимости от роли
    if (userRole === 'admin') next('/admin');
    else if (userRole === 'expert') next('/expert');
    else if (userRole === 'statistician') next('/statistics');
    else if (userRole === 'user') next('/dashboard');
    else next('/auth');
    return;
  }
  
  next();
});

export default router;