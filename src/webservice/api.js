// src/utils/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('inventory-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('inventory-token');
          localStorage.removeItem('inventory-user');
          window.location.href = '/login';
          break;

        case 403:
          // Forbidden
          console.error('Access forbidden:', data.message);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;

        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;

        default:
          console.error('API error:', data.message || 'An error occurred');
      }

      throw new Error(data.errors?.message || data.message || `HTTP error! status: ${status}`);
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      throw new Error('Network error: Unable to connect to server');
    } else {
      // Other errors
      console.error('Error:', error.message);
      throw error;
    }
  }
);

// Generic API methods
export const api = {
  // GET request
  get: (endpoint, params = {}) =>
    apiClient.get(endpoint, { params }),

  // POST request
  post: (endpoint, data = {}) =>
    apiClient.post(endpoint, data),

  // PUT request
  put: (endpoint, data = {}) =>
    apiClient.put(endpoint, data),

  // PATCH request
  patch: (endpoint, data = {}) =>
    apiClient.patch(endpoint, data),

  // DELETE request
  delete: (endpoint) =>
    apiClient.delete(endpoint),

  // Upload file
  upload: (endpoint, formData, onUploadProgress = null) =>
    apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
};


// Task API functions
export const taskAPI = {
  // Get all tasks
  getTasks: (params = {}) =>
    api.get('/api/tasks', params),

  // Get single task
  getTask: (id) =>
    api.get(`/api/tasks/${id}`),

  // Create task
  createTask: (taskData) =>
    api.post('/api/tasks', taskData),

  // Update task
  updateTask: (id, taskData) =>
    api.put(`/api/tasks/${id}`, taskData),

  // Delete task
  deleteTask: (id) =>
    api.delete(`/api/tasks/${id}`),

  // Update task status
  updateTaskStatus: (id, status) =>
    api.patch(`/api/tasks/${id}/status`, { status }),

};

// Auth API functions
export const authAPI = {
  // Login
  login: (credentials) =>
    api.post('/api/auth/login', credentials),

  // Register
  register: (userData) =>
    api.post('/api/auth/register', userData),

  // Get current user
  getCurrentUser: () =>
    api.get('/api/auth/me'),

  // Update profile
  updateProfile: (userData) =>
    api.put('/api/auth/profile', userData)
};

// Delivery API functions
export const deliveryAPI = {
  // Get all deliveries
  getDeliveries: (params = {}) =>
    api.get('/deliveries', params),

  // Get single delivery
  getDelivery: (id) =>
    api.get(`/deliveries/${id}`),

  // Create delivery
  createDelivery: (deliveryData) =>
    api.post('/deliveries', deliveryData),

  // Update delivery
  updateDelivery: (id, deliveryData) =>
    api.put(`/deliveries/${id}`, deliveryData),

  // Delete delivery
  deleteDelivery: (id) =>
    api.delete(`/deliveries/${id}`),

  // Get delivery statistics
  getDeliveryStats: (params = {}) =>
    api.get('/deliveries/stats/overview', params),

  // Get daily delivery report
  getDailyDeliveryReport: (date) =>
    api.get('/deliveries/reports/daily', { date })
};

// Delivery Agent API functions
export const deliveryAgentAPI = {
  // Get all agents
  getAgents: (params = {}) =>
    api.get('/api/delivery-agents', params),

  // Get single agent
  getAgent: (id) =>
    api.get(`/api/delivery-agents/${id}`),

  // Create agent
  createAgent: (agentData) =>
    api.post('/api/delivery-agents', agentData),

  // Update agent
  updateAgent: (id, agentData) =>
    api.put(`/api/delivery-agents/${id}`, agentData),

  // Delete agent
  deleteAgent: (id) =>
    api.delete(`/api/delivery-agents/${id}`),

  // Get agent statistics
  getAgentStats: (params = {}) =>
    api.get('/api/delivery-agents/stats/overview', params),

  // Get agent performance
  getAgentPerformance: (id, params = {}) =>
    api.get(`/api/delivery-agents/${id}/performance`, params)
};

// Cash Collection API functions
export const cashCollectionAPI = {
  // Get all collections
  getCollections: (params = {}) =>
    api.get('/api/cash-collections', params),

  // Create collection
  createCollection: (collectionData) =>
    api.post('/api/cash-collections', collectionData),

  // Get daily collection report
  getDailyCollectionReport: (date) =>
    api.get('/api/cash-collections/reports/daily', { date }),

  // Get collection statistics
  getCollectionStats: (params = {}) =>
    api.get('/api/cash-collections/stats/overview', params)
};

// Expense API functions
export const expenseAPI = {
  // Get all expenses
  getExpenses: (params = {}) =>
    api.get('/api/expenses', params),

  // Get single expense
  getExpense: (id) =>
    api.get(`/api/expenses/${id}`),

  // Create expense
  createExpense: (expenseData) =>
    api.post('/api/expenses', expenseData),

  // Update expense
  updateExpense: (id, expenseData) =>
    api.put(`/api/expenses/${id}`, expenseData),

  // Delete expense
  deleteExpense: (id) =>
    api.delete(`/api/expenses/${id}`),

  // Get expense statistics
  getExpenseStats: (params = {}) =>
    api.get('/api/expenses/stats/overview', params),

  // Get monthly expense report
  getMonthlyExpenseReport: (year, month) =>
    api.get('/api/expenses/reports/monthly', { year, month })
};


// Health check
export const healthCheck = () =>
  api.get('/health');

export default apiClient;