import axios from 'axios';

// Get base URL from environment variable or default
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/api';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - Check if backend is running on port 9090');
    }
    
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: async (credentials) => {
    try {
      console.log('Sending login request:', credentials);
      const response = await API.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.code === 'ERR_NETWORK') {
        throw { message: 'Cannot connect to server. Please check if the backend is running.' };
      } else {
        throw { message: 'Login failed. Please try again.' };
      }
    }
  },
  
  test: async () => {
    try {
      const response = await API.get('/auth/test');
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        throw { message: 'Cannot connect to server. Please check if the backend is running.' };
      }
      throw error.response?.data || { message: 'Connection test failed' };
    }
  },
};

// Books API endpoints
export const booksAPI = {
  getAll: () => API.get('/books'),
  getById: (id) => API.get(`/books/${id}`),
  create: (bookData) => API.post('/books', bookData),
  delete: (id) => API.delete(`/books/${id}`),
  search: async (searchTerm) => {
    try {
      console.log('Searching for books:', searchTerm);
      const response = await API.get(`/books/search?q=${encodeURIComponent(searchTerm)}`);
      console.log('Search results:', response.data);
      return response.data;
    } catch (error) {
      console.error('Book search error:', error);
      if (error.code === 'ERR_NETWORK') {
        throw { message: 'Cannot connect to server. Please check if the backend is running.' };
      }
      throw error.response?.data || { message: 'Search failed. Please try again.' };
    }
  },
};

// Users API endpoints
export const usersAPI = {
  getAll: () => API.get('/users'),
  getById: (id) => API.get(`/users/${id}`),
  create: (userData) => API.post('/users', userData),
  delete: (id) => API.delete(`/users/${id}`),
};

// Transactions API endpoints
export const transactionsAPI = {
  getAll: () => API.get('/transactions'),
  borrowBook: (userId, bookId) => 
    API.post(`/transactions/borrow?userId=${userId}&bookId=${bookId}`),
  returnBook: (userId, bookId) => 
    API.post(`/transactions/return?userId=${userId}&bookId=${bookId}`),
};

// Students API endpoints
export const studentsAPI = {
  update: (id, studentData) => API.put(`/students/${id}`, studentData),
};

// Teachers API endpoints
export const teachersAPI = {
  update: (id, teacherData) => API.put(`/teachers/${id}`, teacherData),
};

export default API;