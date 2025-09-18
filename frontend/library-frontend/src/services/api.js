import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: 'http://localhost:9090/api', // Your Spring Boot backend URL
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
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },
  
  test: async () => {
    try {
      const response = await API.get('/auth/test');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Connection failed' };
    }
  },
};

// Books API endpoints
export const booksAPI = {
  getAll: () => API.get('/books'),
  getById: (id) => API.get(`/books/${id}`),
  create: (bookData) => API.post('/books', bookData),
  delete: (id) => API.delete(`/books/${id}`),
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