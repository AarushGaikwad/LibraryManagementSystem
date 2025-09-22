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
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye
} from 'react-icons/fa';
import { utils } from 'utils/constants';
import SearchBar from 'components/UI/SearchBar';
import BookSearch from 'components/BookSearch/BookSearch';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showFullSearch, setShowFullSearch] = useState(false);
  const [quickSearchResults, setQuickSearchResults] = useState([]);
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, search, manage-books, manage-users
  const [stats, setStats] = useState({
    totalUsers: 156,
    totalBooks: 2847,
    activeTransactions: 89,
    overdueBooks: 23,
  });

  const [recentActivity] = useState([
    { id: 1, action: 'New user registration', user: 'John Doe', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Book returned', user: 'Jane Smith', time: '15 minutes ago', type: 'transaction' },
    { id: 3, action: 'New book added', user: 'System', time: '1 hour ago', type: 'book' },
    { id: 4, action: 'Overdue reminder sent', user: 'System', time: '2 hours ago', type: 'system' },
    { id: 5, action: 'Book borrowed', user: 'Alice Johnson', time: '3 hours ago', type: 'transaction' },
  ]);

  const [overdueBooks] = useState([
    { 
      id: 1, 
      title: 'Introduction to Algorithms', 
      author: 'Thomas Cormen',
      borrower: 'John Smith',
      dueDate: '2024-01-15',
      daysOverdue: 12
    },
    { 
      id: 2, 
      title: 'Clean Code', 
      author: 'Robert Martin',
      borrower: 'Sarah Wilson',
      dueDate: '2024-01-20',
      daysOverdue: 7
    },
    { 
      id: 3, 
      title: 'Design Patterns', 
      author: 'Gang of Four',
      borrower: 'Mike Davis',
      dueDate: '2024-01-25',
      daysOverdue: 2
    },
  ]);

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

  // Handle search results from SearchBar
  const handleSearchResults = (results, query, action) => {
    setQuickSearchResults(results);
    
    if (action === 'select' || results.length > 0) {
      setActiveView('search');
    }
  };

  // Handle search start
  const handleSearchStart = (query) => {
    setActiveView('search');
  };

  // Handle book actions
  const handleBookAction = (book, action) => {
    console.log(`${action} action for book:`, book);
    
    switch (action) {
      case 'manage':
        alert(`Managing "${book.title}" - Admin privileges\nID: ${book.id}\nStatus: ${book.available ? 'Available' : 'Not Available'}`);
        break;
      case 'details':
        alert(`Book Details:\nTitle: ${book.title}\nAuthor: ${book.author}\nID: ${book.id}\nAvailable: ${book.available ? 'Yes' : 'No'}`);
        break;
      case 'edit':
        alert(`Editing "${book.title}"`);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
          alert(`Deleting "${book.title}"`);
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      onClick: () => setActiveView('manage-users')
    },
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: FaBook,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      onClick: () => setActiveView('manage-books')
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
      urgent: true
    },
  ];

  const quickActions = [
    { title: 'Add New Book', icon: FaBook, color: 'from-blue-500 to-blue-600', action: () => alert('Add New Book') },
    { title: 'Add New User', icon: FaUsers, color: 'from-green-500 to-green-600', action: () => alert('Add New User') },
    { title: 'View Reports', icon: FaChartBar, color: 'from-purple-500 to-purple-600', action: () => alert('View Reports') },
    { title: 'System Settings', icon: FaCog, color: 'from-gray-500 to-gray-600', action: () => alert('System Settings') },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <FaUsers className="w-4 h-4 text-blue-400" />;
      case 'book': return <FaBook className="w-4 h-4 text-green-400" />;
      case 'transaction': return <FaExchangeAlt className="w-4 h-4 text-purple-400" />;
      case 'system': return <FaCog className="w-4 h-4 text-gray-400" />;
      default: return <FaCog className="w-4 h-4 text-gray-400" />;
    }
  };

  // Render search view
  if (activeView === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to Dashboard
                </button>
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-lg">
                  <FaUserShield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Library Catalog Management</h1>
                  <p className="text-sm text-gray-400">Search and manage all library resources</p>
                </div>
              </div>

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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BookSearch 
            userRole="ADMIN" 
            onBookSelect={handleBookAction}
            compact={false}
          />
        </main>
      </div>
    );
  }

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
                {/* <p className="text-sm text-gray-400">Library Management System</p> */}
              </div>
            </div>


            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-base font-medium text-white">{user?.name}</p>
                {/* <p className="text-xs text-gray-400">{user?.email}</p> */}
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
            {(() => {
              const hour = new Date().getHours();
              let greeting = "Hello";

              if (hour < 12) greeting = "Good Morning";
              else if (hour < 18) greeting = "Good Afternoon";
              else greeting = "Good Evening";

              return `${greeting}, ${user?.name || "Admin"}!`;
            })()}
          </h2>
          <p className="text-gray-400">
            Monitor user activity, manage books, and keep your library running smoothly.
          </p>
        </div>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              onClick={stat.onClick}
              className={`
                p-6 rounded-xl border ${stat.borderColor} ${stat.bgColor}
                backdrop-blur-sm hover:scale-105 transition-transform duration-200
                ${stat.onClick ? 'cursor-pointer hover:shadow-lg' : ''}
                ${stat.urgent ? 'ring-2 ring-red-500/30' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  {stat.urgent && (
                    <p className="text-red-400 text-xs mt-1">Requires attention</p>
                  )}
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Search and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Advanced Search */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Library Catalog Search</h3>
                <p className="text-gray-400 text-sm">
                  Search and manage all library resources
                </p>
              </div>
              <button 
                onClick={() => setActiveView('search')}
                className="
                  px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 
                  hover:from-red-600 hover:to-red-700 text-white rounded-lg
                  font-medium transition-all duration-200 btn-hover flex items-center space-x-2
                "
              >
                <FaSearch />
                <span>Advanced Search</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="
                    p-3 bg-gray-700/50 border border-gray-600 rounded-lg
                    hover:border-gray-500 hover:bg-gray-700/70 transition-all duration-200
                    group text-left
                  "
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium group-hover:text-gray-200 text-sm">
                      {action.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{activity.action}</p>
                      <p className="text-gray-400 text-xs">by {activity.user}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Books - Critical */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-red-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-semibold text-white">Overdue Books</h3>
                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                  Critical
                </span>
              </div>
              <button className="text-red-400 hover:text-red-300 text-sm">
                Send Reminders
              </button>
            </div>
            <div className="space-y-4">
              {overdueBooks.map((book) => (
                <div key={book.id} className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm mb-1">{book.title}</h4>
                      <p className="text-gray-400 text-xs">by {book.author}</p>
                      <p className="text-red-400 text-xs mt-1">
                        Borrowed by: {book.borrower}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-red-500/30 text-red-300 text-xs rounded-full mb-2">
                        {book.daysOverdue} days overdue
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-xs"
                          onClick={() => alert(`Contacting ${book.borrower} about "${book.title}"`)}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-yellow-400 hover:text-yellow-300 text-xs"
                          onClick={() => alert(`Extending due date for "${book.title}"`)}
                        >
                          Extend
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {overdueBooks.length === 0 && (
              <div className="text-center py-6">
                <FaBook className="text-4xl text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No overdue books</p>
              </div>
            )}
          </div>
        </div>

        
      </main>
    </div>
  );
};

export default AdminDashboard;