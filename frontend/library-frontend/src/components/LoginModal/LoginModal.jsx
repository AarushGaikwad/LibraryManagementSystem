// src/components/LoginModal/LoginModal.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import Modal from '../UI/Modal';
import { authAPI } from '../../services/api';
import { ROLE_CONFIG, utils } from '../../utils/constants';

const LoginModal = ({ isOpen, onClose, selectedRole }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleConfig = selectedRole ? ROLE_CONFIG[selectedRole] : null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!utils.isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // Verify user role matches selected role
        if (response.data.authority !== selectedRole) {
          setError(`Access denied. This account is not registered as ${selectedRole.toLowerCase()}.`);
          return;
        }

        // Save user data
        utils.saveUserData(response);

        // Save remember me preference
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Navigate to dashboard
        navigate(roleConfig.route);
        onClose();
        
        // Reset form
        setFormData({ email: '', password: '', rememberMe: false });
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(utils.formatErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setFormData({ email: '', password: '', rememberMe: false });
    onClose();
  };

  if (!roleConfig) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={roleConfig.title}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Role Description */}
        <div className="text-center">
          <p className="text-gray-300 text-sm">
            {roleConfig.description}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="
                w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:border-transparent transition-colors
              "
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="
                  w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 
                  rounded-lg text-white placeholder-gray-400 focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  transition-colors
                "
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute right-3 top-1/2 transform -translate-y-1/2 
                  text-gray-400 hover:text-white transition-colors
                "
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="
                w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 
                rounded focus:ring-blue-500 focus:ring-2
              "
              disabled={loading}
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
              Remember me
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 px-4 rounded-lg font-medium text-white
              bg-gradient-to-r ${roleConfig.color} ${roleConfig.hoverColor}
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 flex items-center justify-center
              ${loading ? 'cursor-not-allowed' : 'btn-hover'}
            `}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              `Sign in as ${selectedRole}`
            )}
          </button>
        </form>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Having trouble? Contact your system administrator
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;