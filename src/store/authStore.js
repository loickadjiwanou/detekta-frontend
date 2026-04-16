import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          set({ user: response.data, isAuthenticated: true, isLoading: false });
          return { success: true, data: response.data };
        } catch (error) {
          set({ isLoading: false });
          const detail = error.response?.data?.detail;
          let message = 'Login failed';
          if (typeof detail === 'string') message = detail;
          else if (Array.isArray(detail)) message = detail.map(e => e.msg || e).join(' ');
          return { success: false, error: message };
        }
      },

      register: async (email, password, full_name, marketing_emails = false) => {
        try {
          const response = await api.post('/auth/register', { 
            email, 
            password, 
            full_name,
            marketing_emails 
          });
          set({ user: response.data, isAuthenticated: true, isLoading: false });
          return { success: true, data: response.data };
        } catch (error) {
          set({ isLoading: false });
          const detail = error.response?.data?.detail;
          let message = 'Registration failed';
          if (typeof detail === 'string') message = detail;
          else if (Array.isArray(detail)) message = detail.map(e => e.msg || e).join(' ');
          return { success: false, error: message };
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (e) {
          // Ignore logout errors
        }
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/auth/me');
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      }
    }),
    {
      name: 'detekta-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);

export default useAuthStore;
