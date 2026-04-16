import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for auth endpoints to prevent loops
    const skipRefreshPaths = ['/auth/me', '/auth/login', '/auth/register', '/auth/refresh'];
    const shouldSkipRefresh = skipRefreshPaths.some(path => originalRequest.url?.includes(path));

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry && !shouldSkipRefresh) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
