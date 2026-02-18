import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, loading: false });
      
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        loading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  register: async (name, email, password, password_confirmation) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/register', { 
        name, 
        email, 
        password, 
        password_confirmation 
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, loading: false });
      
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        loading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    }
  },

  fetchUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      const response = await api.get('/me');
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;