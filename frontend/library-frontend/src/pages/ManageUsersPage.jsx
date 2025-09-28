import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaEdit, 
  FaSignOutAlt, 
  FaUserShield,
  FaFilter,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaSpinner
} from 'react-icons/fa';
import { utils } from 'utils/constants';
import { usersAPI } from 'services/api';
import EditUserModal from '../components/UI/EditUserModal';

const ManageUsersPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, TEACHER, STUDENT
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const userData = utils.getUserData();
    if (!userData || userData.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    setUser(userData);
    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    // Filter users based on selected filter
    let filtered = users.filter(u => u.role !== 'ADMIN'); // Exclude admins
    
    if (filter === 'TEACHER') {
      filtered = filtered.filter(u => u.role === 'TEACHER');
    } else if (filter === 'STUDENT') {
      filtered = filtered.filter(u => u.role === 'STUDENT');
    }
    
    setFilteredUsers(filtered);
  }, [users, filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await usersAPI.getAllUsers();
      setUsers(response);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    utils.clearUserData();
    navigate('/');
  };

  const handleEditUser = (userToEdit) => {
    setSelectedUser(userToEdit);
    setShowEditModal(true);
  };

  const handleUpdateSuccess = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    fetchUsers(); // Refresh the user list
  };

  const getUserIcon = (role) => {
    return role === 'TEACHER' ? FaChalkboardTeacher : FaUserGraduate;
  };

  const getUserCardColor = (role) => {
    return role === 'TEACHER' 
      ? 'from-blue-500/10 to-blue-600/10 border-blue-500/20' 
      : 'from-green-500/10 to-green-600/10 border-green-500/20';
  };

  const getFilterStats = () => {
    const teacherCount = users.filter(u => u.role === 'TEACHER').length;
    const studentCount = users.filter(u => u.role === 'STUDENT').length;
    return { teacherCount, studentCount, total: teacherCount + studentCount };
  };

  const stats = getFilterStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Dashboard
              </button>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Manage Users</h1>
                <p className="text-sm text-gray-400">Update teacher and student information</p>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-base font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="
                  flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700
                  text-white rounded-lg transition-colors duration-200
                "
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats and Filter Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Stats Cards */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <FaUsers className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Teachers</p>
                  <p className="text-2xl font-bold text-white">{stats.teacherCount}</p>
                </div>
                <FaChalkboardTeacher className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Students</p>
                  <p className="text-2xl font-bold text-white">{stats.studentCount}</p>
                </div>
                <FaUserGraduate className="w-8 h-8 text-green-400" />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <FaFilter className="w-5 h-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="
                    bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                    flex-1
                  "
                >
                  <option value="ALL">All Users ({stats.total})</option>
                  <option value="TEACHER">Teachers ({stats.teacherCount})</option>
                  <option value="STUDENT">Students ({stats.studentCount})</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-white">Loading users...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-6 mb-6">
            <p className="text-red-400 text-center">
              <strong>Error:</strong> {error}
            </p>
            <div className="mt-4 text-center">
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Users Grid */}
        {!loading && !error && (
          <>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  {filter === 'ALL' ? 'No users found' : `No ${filter.toLowerCase()}s found`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((userItem) => {
                  const UserIcon = getUserIcon(userItem.role);
                  return (
                    <div
                      key={userItem.id}
                      className={`
                        bg-gradient-to-br ${getUserCardColor(userItem.role)}
                        backdrop-blur-sm border rounded-xl p-6
                        hover:scale-105 transition-transform duration-200
                      `}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-gray-700/50 rounded-lg">
                            <UserIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {userItem.name}
                            </h3>
                            <span className={`
                              inline-block px-2 py-1 text-xs rounded-full font-medium
                              ${userItem.role === 'TEACHER' 
                                ? 'bg-blue-500/20 text-blue-400' 
                                : 'bg-green-500/20 text-green-400'}
                            `}>
                              {userItem.role}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleEditUser(userItem)}
                          className="
                            p-2 bg-gray-700/50 hover:bg-gray-600/50 
                            text-white rounded-lg transition-colors
                            group
                          "
                          title="Edit User"
                        >
                          <FaEdit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <span className="text-gray-400 w-16">Email:</span>
                          <span className="text-white truncate">{userItem.email}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ManageUsersPage;