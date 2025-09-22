import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBook, 
  FaSignOutAlt, 
  FaChalkboardTeacher,
  FaSearch,
  FaBookOpen,
  FaClock,
  FaPlus
} from 'react-icons/fa';
import { utils } from 'utils/constants';
import SearchBar from 'components/UI/SearchBar';
import BookSearch from 'components/BookSearch/BookSearch';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFullSearch, setShowFullSearch] = useState(false);
  const [quickSearchResults, setQuickSearchResults] = useState([]);
  const [stats, setStats] = useState({
    borrowedBooks: 5,
    reservedBooks: 2,
    overdueBooks: 1,
  });

  const [myBooks, setMyBooks] = useState([
    {
      id: 1,
      title: 'Advanced Mathematics',
      author: 'Dr. Smith',
      dueDate: '2024-02-15',
      status: 'borrowed',
      daysLeft: 3,
    },
    {
      id: 2,
      title: 'Computer Science Fundamentals',
      author: 'Johnson Lee',
      dueDate: '2024-02-20',
      status: 'borrowed',
      daysLeft: 8,
    },
    {
      id: 3,
      title: 'Educational Psychology',
      author: 'Mary Wilson',
      dueDate: '2024-02-10',
      status: 'overdue',
      daysLeft: -2,
    },
  ]);

  const [reservedBooks] = useState([
    {
      id: 4,
      title: 'Machine Learning Fundamentals',
      author: 'Andrew Ng',
      expectedDate: '2024-02-18',
      position: 1,
    },
    {
      id: 5,
      title: 'Data Structures and Algorithms',
      author: 'Robert Sedgewick',
      expectedDate: '2024-02-25',
      position: 3,
    },
  ]);

  useEffect(() => {
    const userData = utils.getUserData();
    if (!userData || userData.role !== 'TEACHER') {
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
      setShowFullSearch(true);
    }
  };

  // Handle search start
  const handleSearchStart = (query) => {
    setShowFullSearch(true);
  };

  // Handle book actions
  const handleBookAction = (book, action) => {
    console.log(`${action} action for book:`, book);
    
    switch (action) {
      case 'borrow':
        alert(`Borrowing "${book.title}" by ${book.author}`);
        break;
      case 'reserve':
        alert(`Reserving "${book.title}" by ${book.author}`);
        break;
      case 'details':
        alert(`Showing details for "${book.title}"`);
        break;
      case 'manage':
        alert(`Managing "${book.title}" - Teacher privileges`);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const getStatusColor = (status, daysLeft) => {
    if (status === 'overdue' || daysLeft < 0) return 'text-red-400 bg-red-500/10';
    if (daysLeft <= 3) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-green-400 bg-green-500/10';
  };

  const getStatusText = (status, daysLeft) => {
    if (status === 'overdue' || daysLeft < 0) return `Overdue by ${Math.abs(daysLeft)} days`;
    if (daysLeft === 0) return 'Due today';
    return `${daysLeft} days left`;
  };

  // If full search is active, show the BookSearch component
  if (showFullSearch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFullSearch(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to Dashboard
                </button>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                  <FaChalkboardTeacher className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Search Library Catalog</h1>
                  <p className="text-sm text-gray-400">Find academic resources and materials</p>
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
                    flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
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

        {/* Full Search Component */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BookSearch 
            userRole="TEACHER" 
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
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                <FaChalkboardTeacher className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Teacher Portal</h1>
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
                  flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
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

              return `${greeting}, Prof. ${user?.name || ""}`;
            })()}
          </h2>
          <p className="text-gray-400">
            Here’s your library summary and resources.
          </p>
        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-xl border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Borrowed Books</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.borrowedBooks}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                <FaBookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-green-500/20 bg-green-500/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Reserved Books</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.reservedBooks}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                <FaBook className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Overdue Books</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.overdueBooks}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600">
                <FaClock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Search Button */}
        <div className="mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Search Library Catalog</h3>
                <p className="text-gray-400 text-sm">
                  Find academic resources, research materials, and course books
                </p>
              </div>
              <button 
                onClick={() => setShowFullSearch(true)}
                className="
                  px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                  hover:from-blue-600 hover:to-blue-700 text-white rounded-lg
                  font-medium transition-all duration-200 btn-hover flex items-center space-x-2
                "
              >
                <FaSearch />
                <span>Advanced Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* My Books and Reservations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Borrowed Books */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">My Borrowed Books</h3>
              <button className="
                flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600
                hover:from-green-600 hover:to-green-700 text-white rounded-lg
                font-medium transition-all duration-200 btn-hover text-sm
              ">
                <FaPlus className="w-4 h-4" />
                <span>Request Book</span>
              </button>
            </div>

            <div className="space-y-4">
              {myBooks.map((book) => (
                <div
                  key={book.id}
                  className="
                    p-4 bg-gray-700/50 border border-gray-600 rounded-lg
                    hover:border-gray-500 transition-colors duration-200
                  "
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-white mb-1">{book.title}</h4>
                      <p className="text-gray-400 text-sm">by {book.author}</p>
                      <p className="text-gray-500 text-xs mt-1">Due: {book.dueDate}</p>
                    </div>
                    
                    <div className="text-right">
                      <span
                        className={`
                          inline-block px-3 py-1 rounded-full text-xs font-medium
                          ${getStatusColor(book.status, book.daysLeft)}
                        `}
                      >
                        {getStatusText(book.status, book.daysLeft)}
                      </span>
                      <div className="mt-2 space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Renew
                        </button>
                        <button className="text-green-400 hover:text-green-300 text-sm">
                          Return
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reserved Books */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">My Reservations</h3>
              <span className="text-sm text-gray-400">
                {reservedBooks.length} book{reservedBooks.length !== 1 ? 's' : ''} reserved
              </span>
            </div>

            <div className="space-y-4">
              {reservedBooks.map((book) => (
                <div
                  key={book.id}
                  className="
                    p-4 bg-gray-700/50 border border-gray-600 rounded-lg
                    hover:border-gray-500 transition-colors duration-200
                  "
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-white mb-1">{book.title}</h4>
                      <p className="text-gray-400 text-sm">by {book.author}</p>
                      <p className="text-gray-500 text-xs mt-1">Expected: {book.expectedDate}</p>
                    </div>
                    
                    <div className="text-right">
                      <span className="
                        inline-block px-3 py-1 rounded-full text-xs font-medium
                        text-yellow-400 bg-yellow-500/10
                      ">
                        Position #{book.position}
                      </span>
                      <div className="mt-2">
                        <button className="text-red-400 hover:text-red-300 text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {reservedBooks.length === 0 && (
                <div className="text-center py-8">
                  <FaBook className="text-4xl text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No reserved books</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Search and reserve books for future borrowing
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;