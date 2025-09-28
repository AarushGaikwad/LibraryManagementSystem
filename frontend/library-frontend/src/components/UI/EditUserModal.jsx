import { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaSave, 
  FaSpinner,
  FaChalkboardTeacher,
  FaUserGraduate
} from 'react-icons/fa';
import { studentsAPI, teachersAPI } from 'services/api';

const EditUserModal = ({ user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // Student specific
    yearOfStudy: '',
    branch: '',
    // Teacher specific
    department: '',
    designation: ''
  });

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        yearOfStudy: '',
        branch: '',
        department: '',
        designation: ''
      });
      
      // Fetch additional user details based on role
      fetchUserDetails();
    }
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      if (user.role === 'STUDENT') {
        // For students, we need to fetch additional details
        // Since we don't have a direct API endpoint, we'll use the existing data
        // In a real app, you might need a specific endpoint for this
        setFormData(prev => ({
          ...prev,
          yearOfStudy: 1, // Default value, should come from API
          branch: 'Computer Science' // Default value, should come from API
        }));
      } else if (user.role === 'TEACHER') {
        // For teachers, similar approach
        setFormData(prev => ({
          ...prev,
          department: 'Computer Science', // Default value, should come from API
          designation: 'Assistant Professor' // Default value, should come from API
        }));
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (user.role === 'STUDENT') {
        const studentData = {
          name: formData.name,
          email: formData.email,
          yearOfStudy: parseInt(formData.yearOfStudy),
          branch: formData.branch
        };
        await studentsAPI.update(user.id, studentData);
      } else if (user.role === 'TEACHER') {
        const teacherData = {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          designation: formData.designation
        };
        await teachersAPI.update(user.id, teacherData);
      }

      onSuccess();
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const baseValid = formData.name.trim() && formData.email.trim();
    
    if (user.role === 'STUDENT') {
      return baseValid && formData.yearOfStudy && formData.branch.trim();
    } else if (user.role === 'TEACHER') {
      return baseValid && formData.department.trim() && formData.designation.trim();
    }
    
    return baseValid;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              user.role === 'TEACHER' 
                ? 'bg-blue-500/20' 
                : 'bg-green-500/20'
            }`}>
              {user.role === 'TEACHER' ? (
                <FaChalkboardTeacher className={`w-5 h-5 ${
                  user.role === 'TEACHER' ? 'text-blue-400' : 'text-green-400'
                }`} />
              ) : (
                <FaUserGraduate className="w-5 h-5 text-green-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Edit {user.role === 'TEACHER' ? 'Teacher' : 'Student'}
              </h2>
              <p className="text-sm text-gray-400">
                Update user information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            disabled={loading}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Common Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="
                w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                text-white placeholder-gray-400
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              placeholder="Enter full name"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="
                w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                text-white placeholder-gray-400
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              placeholder="Enter email address"
              required
              disabled={loading}
            />
          </div>

          {/* Student Specific Fields */}
          {user.role === 'STUDENT' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year of Study *
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleInputChange}
                  className="
                    w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                    text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  required
                  disabled={loading}
                >
                  <option value="">Select Year</option>
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Branch *
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="
                    w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                    text-white placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  placeholder="Enter branch (e.g., Computer Science)"
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}

          {/* Teacher Specific Fields */}
          {user.role === 'TEACHER' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="
                    w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                    text-white placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  placeholder="Enter department"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Designation *
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="
                    w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                    text-white placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  placeholder="Enter designation (e.g., Assistant Professor)"
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600
                text-white rounded-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="
                flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700
                text-white rounded-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center space-x-2
              "
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  <span>Update User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;