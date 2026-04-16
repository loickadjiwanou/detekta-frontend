import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'en',

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setLanguage: (language) => set({ language }),

      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
      }),

      initTheme: () => {
        const stored = localStorage.getItem('detekta-settings');
        if (stored) {
          const { state } = JSON.parse(stored);
          if (state?.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } else {
          // Default to dark
          document.documentElement.classList.add('dark');
        }
      }
    }),
    {
      name: 'detekta-settings'
    }
  )
);

export default useSettingsStore;
