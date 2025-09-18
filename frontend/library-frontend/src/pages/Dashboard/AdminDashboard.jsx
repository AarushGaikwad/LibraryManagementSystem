import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaBook, 
  FaExchangeAlt, 
  FaSignOutAlt, 
  FaUserShield,
  FaChartBar,
  FaCog,
  FaPlus
} from 'react-icons/fa';
import { utils } from '../../utils/constants';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 156,
    totalBooks: 2847,
    activeTransactions: 89,
    overdueBooks: 23,
  });

  useEffect(() => {
    const userData = utils.getUserData();
    if (!userData || userData.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    utils.clearUserData();
    navigate('/');
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: FaBook,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      title: 'Active Loans',
      value: stats.activeTransactions,
      icon: FaExchangeAlt,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      title: 'Overdue Books',
      value: stats.overdueBooks,
      icon: FaChartBar,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
  ];

  const quickActions = [
    { title: 'Add New Book', icon: FaBook, color: 'from-blue-500 to-blue-600' },
    { title: 'Add New User', icon: FaUsers, color: 'from-green-500 to-green-600' },
    { title: 'View Reports', icon: FaChartBar, color: 'from-purple-500 to-purple-600' },
    { title: 'System Settings', icon: FaCog, color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-lg">
                <FaUserShield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Library Management System</p>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-400">
            Here's what's happening in your library today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`
                p-6 rounded-xl border ${stat.borderColor} ${stat.bgColor}
                backdrop-blur-sm hover:scale-105 transition-transform duration-200
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="
                  p-4 bg-gray-800/50 border border-gray-700 rounded-xl
                  hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-200
                  group text-left
                "
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium group-hover:text-gray-200">
                    {action.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New user registration', user: 'John Doe', time: '2 minutes ago' },
              { action: 'Book returned', user: 'Jane Smith', time: '15 minutes ago' },
              { action: 'New book added', user: 'System', time: '1 hour ago' },
              { action: 'Overdue reminder sent', user: 'System', time: '2 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                <div>
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-sm">by {activity.user}</p>
                </div>
                <p className="text-gray-500 text-sm">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;