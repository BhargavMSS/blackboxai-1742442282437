import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Pawn Loan API calls
export const pawnLoanAPI = {
  getAll: (params) => api.get('/pawn', { params }),
  getById: (id) => api.get(`/pawn/${id}`),
  create: (data) => api.post('/pawn', data),
  update: (id, data) => api.put(`/pawn/${id}`, data),
  delete: (id) => api.delete(`/pawn/${id}`),
  addRepayment: (id, data) => api.post(`/pawn/${id}/repayment`, data),
  getStats: () => api.get('/pawn/stats')
};

// Horticulture API calls
export const horticultureAPI = {
  getAll: (params) => api.get('/horticulture', { params }),
  getById: (id) => api.get(`/horticulture/${id}`),
  create: (data) => api.post('/horticulture', data),
  update: (id, data) => api.put(`/horticulture/${id}`, data),
  delete: (id) => api.delete(`/horticulture/${id}`),
  addExpense: (id, data) => api.post(`/horticulture/${id}/expense`, data),
  updateHarvest: (id, data) => api.put(`/horticulture/${id}/harvest`, data),
  getStats: () => api.get('/horticulture/stats')
};

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// Error handler helper
export const handleApiError = (error) => {
  let errorMessage = 'An error occurred. Please try again.';
  
  if (error.response) {
    // Server responded with error
    errorMessage = error.response.data.error || error.response.data.message || errorMessage;
    
    // Handle specific status codes
    switch (error.response.status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 422:
        errorMessage = 'Invalid data provided. Please check your input.';
        break;
      default:
        if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
    }
  } else if (error.request) {
    // Request made but no response
    errorMessage = 'Unable to connect to the server. Please check your internet connection.';
  }

  return {
    error: true,
    message: errorMessage
  };
};

export default api;
