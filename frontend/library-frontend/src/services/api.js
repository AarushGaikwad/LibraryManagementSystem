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
  // api to return total book count
  getCount: async () => {
    const response = await API.get('/books/count');
    return response.data;
  }
};

// Users API endpoints
export const usersAPI = {
  // Get all users (Admin only)
  getAllUsers: async () => {
    try {
      const response = await API.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error.response?.data || { message: "Failed to fetch users" };
    }
  },

  // Get user by ID
  getById: async (id) => {
    try {
      const response = await API.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error.response?.data || { message: "Failed to fetch user" };
    }
  },

  // Create new user (Admin only)
  create: async (userData) => {
    try {
      console.log("Creating user:", userData);
      const response = await API.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.code === "ERR_NETWORK") {
        throw { message: "Cannot connect to server. Please check if backend is running." };
      }
      throw error.response?.data || { message: "Failed to create user" };
    }
  },

  // Delete user by ID (Admin only)
  delete: async (id) => {
    try {
      const response = await API.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error.response?.data || { message: "Failed to delete user" };
    }
  },

  // Update user by ID (Admin only)
  update: async (id, userData) => {
    try {
      const response = await API.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error.response?.data || {message: "Failed to update user"};
    }
  },

  // real time count of users
  getCount: async () => {
    try {
      const response = await API.get('/users/count');
      return response.data;
    } catch (error) {
      console.error("Error fetching user count:", error);
      throw error.response?.data || { message: "Failed to fetch user count" };
    }
  }
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
  update: async (id, studentData) => {
    try {
      const response = await API.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error.response?.data || { message: "Failed to update student" };
    }
  }
};

// Teachers API endpoints
export const teachersAPI = {
  update: async (id, teacherData) => {
    try {
      const response = await API.put(`/teachers/${id}`, teacherData);
      return response.data;
    } catch (error) {
      console.error("Error updating teacher:", error);
      throw error.response?.data || { message: "Failed to update teacher" };
    }
  }
};

export default API;