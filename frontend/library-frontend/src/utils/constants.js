// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
};

// Role configurations for UI
export const ROLE_CONFIG = {
  [USER_ROLES.ADMIN]: {
    title: 'Admin Login',
    description: 'System Administration',
    icon: 'FaUserShield',
    color: 'from-red-500 to-red-600',
    hoverColor: 'hover:from-red-600 hover:to-red-700',
    route: '/admin/dashboard',
  },
  [USER_ROLES.TEACHER]: {
    title: 'Teacher Login',
    description: 'Faculty Portal',
    icon: 'FaChalkboardTeacher',
    color: 'from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700',
    route: '/teacher/dashboard',
  },
  [USER_ROLES.STUDENT]: {
    title: 'Student Login',
    description: 'Student Portal',
    icon: 'FaGraduationCap',
    color: 'from-green-500 to-green-600',
    hoverColor: 'hover:from-green-600 hover:to-green-700',
    route: '/student/dashboard',
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  REMEMBER_ME: 'rememberMe',
};

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:9090/api',
  AUTH: {
    LOGIN: '/auth/login',
    TEST: '/auth/test',
  },
};

// Utility functions
export const utils = {
  // Save user data to localStorage
  saveUserData: (userData) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, userData.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
      id: userData.data.userid,
      name: userData.data.name,
      email: userData.data.email,
      role: userData.data.authority,
    }));
  },

  // Get user data from localStorage
  getUserData: () => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Clear user data from localStorage
  clearUserData: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // Get user role
  getUserRole: () => {
    const user = utils.getUserData();
    return user?.role || null;
  },

  // Format error message
  formatErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    return 'An unexpected error occurred';
  },

  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};