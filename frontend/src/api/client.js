import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
          { refresh_token: refreshToken }
        );

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signupWithOtp: (data) => API.post('/auth/signup-with-otp', data),
  verifyOtp: (data) => API.post('/auth/verify-otp', data),
  setPassword: (data, setupToken) =>
    API.post('/auth/set-password', data, {
      headers: { setup_token: `Bearer ${setupToken}` }
    }),
  login: (data) => API.post('/auth/login', data),
  refreshToken: (refreshToken) =>
    API.post('/auth/refresh-token', { refresh_token: refreshToken }),
  getMe: () => API.get('/auth/me'),
  logout: () => API.post('/auth/logout'),
};

// Onboarding endpoints
export const onboardingAPI = {
  start: () => API.post('/onboarding/start'),
  saveBasicDetails: (data) => API.post('/onboarding/basic-details', data),
  uploadKycDocuments: (data) => API.post('/onboarding/kyc-documents', data),
  setupPayment: (data) => API.post('/onboarding/payment-setup', data),
  saveBankDetails: (data) => API.post('/onboarding/bank-details', data),
  getStatus: () => API.get('/onboarding/status'),
};

// Products endpoints
export const productsAPI = {
  list: (params) => API.get('/admin/products', { params }),
  get: (id) => API.get(`/admin/products/${id}`),
  create: (data) => API.post('/admin/products', data),
  update: (id, data) => API.put(`/admin/products/${id}`, data),
  delete: (id) => API.delete(`/admin/products/${id}`),
  addVariant: (id, data) => API.post(`/admin/products/${id}/variants`, data),
  adjustInventory: (id, data) =>
    API.post(`/admin/products/${id}/adjust-inventory`, data),
  getLowStock: () => API.get('/admin/products/low-stock'),
};

// Orders endpoints
export const ordersAPI = {
  list: (params) => API.get('/admin/orders', { params }),
  get: (id) => API.get(`/admin/orders/${id}`),
  updateStatus: (id, data) => API.put(`/admin/orders/${id}/status`, data),
  generateInvoice: (id) => API.get(`/admin/orders/${id}/invoice`),
  requestReturn: (id, data) =>
    API.post(`/admin/orders/${id}/return-request`, data),
};

// Payments endpoints
export const paymentsAPI = {
  list: (params) => API.get('/admin/payments', { params }),
  getSettlements: () => API.get('/admin/payments/settlements'),
  processRefund: (id, data) => API.post(`/admin/payments/${id}/refund`, data),
};

// Analytics endpoints
export const analyticsAPI = {
  getSummary: () => API.get('/admin/analytics/summary'),
  getSalesTrend: (params) => API.get('/admin/analytics/sales-trend', { params }),
  getTopProducts: () => API.get('/admin/analytics/top-products'),
};

// Settings endpoints
export const settingsAPI = {
  get: () => API.get('/admin/settings'),
  update: (data) => API.put('/admin/settings', data),
  getProfile: () => API.get('/admin/settings/profile'),
  updateProfile: (data) => API.put('/admin/settings/profile', data),
};

export default API;
