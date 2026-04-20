import create from 'zustand';
import { authAPI } from '../api/client';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (phone, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ phone, password });
      const { access_token, refresh_token, user } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      set({
        user,
        accessToken: access_token,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signupWithOtp: async (phone, businessName, email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.signupWithOtp({
        phone,
        business_name: businessName,
        email,
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  verifyOtp: async (phone, otp) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.verifyOtp({ phone, otp });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'OTP verification failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  setPassword: async (phone, password, setupToken) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.setPassword(
        { phone, password, confirm_password: password },
        setupToken
      );
      const { access_token, refresh_token, user } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      set({
        user,
        accessToken: access_token,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Password setup failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
