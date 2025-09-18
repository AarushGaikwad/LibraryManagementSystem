// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Import pages
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import TeacherDashboard from './pages/Dashboard/TeacherDashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';

// Import utilities
import { utils } from './utils/constants';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = utils.isAuthenticated();
      const userRole = utils.getUserRole();
      
      if (!isAuthenticated) {
        setIsAuthorized(false);
      } else if (allowedRole && userRole !== allowedRole) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [allowedRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : <Navigate to="/" replace />;
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route - Home Page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Protected Routes - Dashboards */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute allowedRole="TEACHER">
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;