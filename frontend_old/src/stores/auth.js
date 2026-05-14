import { reactive, computed } from 'vue';

const state = reactive({
  token: localStorage.getItem('token'),
  user: null
});

export const useAuth = () => {
  const isAuthenticated = computed(() => !!state.token);
  const user = computed(() => state.user);
  const userRole = computed(() => state.user?.role);

  const setAuth = (token, userData) => {
    state.token = token;
    state.user = userData;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    state,
    isAuthenticated,
    user,
    userRole,
    setAuth,
    logout
  };
};