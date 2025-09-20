import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBook, 
  FaSignOutAlt, 
  FaGraduationCap,
  FaSearch,
  FaBookOpen,
  FaClock,
  FaHeart,
  FaDownload
} from 'react-icons/fa';
import { utils } from 'utils/constants';
import SearchBar from 'components/UI/SearchBar';
import BookSearch from 'components/BookSearch/BookSearch';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('borrowed');
  const [showFullSearch, setShowFullSearch] = useState(false);
  const [quickSearchResults, setQuickSearchResults] = useState([]);
  
  const [stats, setStats] = useState({
    borrowedBooks: 3,
    wishlistBooks: 8,
    overdueBooks: 0,
    booksRead: 25,
  });

  const [borrowedBooks, setBorrowedBooks] = useState([
    {
      id: 1,
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      dueDate: '2024-02-20',
      daysLeft: 8,
      coverUrl: null,
    },
    {
      id: 2,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      dueDate: '2024-02-25',
      daysLeft: 13,
      coverUrl: null,
    },
    {
      id: 3,
      title: 'Design Patterns',
      author: 'Gang of Four',
      dueDate: '2024-02-18',
      daysLeft: 6,
      coverUrl: null,
    },
  ]);

  const [wishlistBooks, setWishlistBooks] = useState([
    { id: 4, title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', available: true },
    { id: 5, title: 'You Don\'t Know JS', author: 'Kyle Simpson', available: false },
    { id: 6, title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', available: true },
  ]);

  const [recommendedBooks] = useState([
    { id: 7, title: 'React: Up & Running', author: 'Stoyan Stefanov', category: 'Programming' },
    { id: 8, title: 'Node.js in Action', author: 'Mike Cantelon', category: 'Web Development' },
    { id: 9, title: 'Python Crash Course', author: 'Eric Matthes', category: 'Programming' },
  ]);

  useEffect(() => {
    const userData = utils.getUserData();
    if (!userData || userData.role !== 'STUDENT') {
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
    // Here you can implement actual book borrowing/reserving logic
    
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
      default:
        console.log('Unknown action:', action);
    }
  };

  const getStatusColor = (daysLeft) => {
    if (daysLeft < 0) return 'text-red-400 bg-red-500/10';
    if (daysLeft <= 3) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-green-400 bg-green-500/10';
  };

  const getStatusText = (daysLeft) => {
    if (daysLeft < 0) return `Overdue by ${Math.abs(daysLeft)} days`;
    if (daysLeft === 0) return 'Due today';
    return `${daysLeft} days left`;
  };

  const tabButtons = [
    { id: 'borrowed', label: 'My Books', count: borrowedBooks.length },
    { id: 'wishlist', label: 'Wishlist', count: wishlistBooks.length },
    { id: 'recommended', label: 'Recommended', count: recommendedBooks.length },
  ];

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
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
                  <FaGraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Search Books</h1>
                  <p className="text-sm text-gray-400">Find your next great read</p>
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
                    flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700
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
            userRole="STUDENT" 
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
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
                <FaGraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Student Portal</h1>
                <p className="text-sm text-gray-400">Library Management System</p>
              </div>
            </div>

            {/* Search Bar and User Info */}
            <div className="flex items-center space-x-4 flex-1 max-w-md mx-8">
              <SearchBar 
                userRole="STUDENT"
                onSearchResults={handleSearchResults}
                onSearchStart={handleSearchStart}
                placeholder="Quick search books..."
                compact={true}
                showResults={true}
              />
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
                  flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700
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
            Continue your learning journey with our vast collection of resources.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-xl border border-green-500/20 bg-green-500/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Borrowed Books</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.borrowedBooks}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                <FaBookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Wishlist</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.wishlistBooks}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                <FaHeart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Overdue</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.overdueBooks}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600">
                <FaClock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-purple-500/20 bg-purple-500/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Books Read</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.booksRead}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                <FaBook className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Search Button */}
        <div className="mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Discover New Books</h3>
                <p className="text-gray-400 text-sm">
                  Use advanced search to find exactly what you're looking for
                </p>
              </div>
              <button 
                onClick={() => setShowFullSearch(true)}
                className="
                  px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 
                  hover:from-green-600 hover:to-green-700 text-white rounded-lg
                  font-medium transition-all duration-200 btn-hover flex items-center space-x-2
                "
              >
                <FaSearch />
                <span>Advanced Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl">
          {/* Tab Navigation */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6 py-4">
              {tabButtons.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 pb-2 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-green-500 text-green-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                    }
                  `}
                >
                  <span>{tab.label}</span>
                  <span className={`
                    px-2 py-1 rounded-full text-xs
                    ${activeTab === tab.id ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-300'}
                  `}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Borrowed Books Tab */}
            {activeTab === 'borrowed' && (
              <div className="space-y-4">
                {borrowedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="
                      p-4 bg-gray-700/50 border border-gray-600 rounded-lg
                      hover:border-gray-500 transition-colors duration-200
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded flex items-center justify-center">
                          <FaBook className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-white mb-1">{book.title}</h4>
                          <p className="text-gray-400 text-sm">by {book.author}</p>
                          <p className="text-gray-500 text-xs mt-1">Due: {book.dueDate}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span
                          className={`
                            inline-block px-3 py-1 rounded-full text-xs font-medium mb-2
                            ${getStatusColor(book.daysLeft)}
                          `}
                        >
                          {getStatusText(book.daysLeft)}
                        </span>
                        <div className="space-x-2">
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
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                {wishlistBooks.map((book) => (
                  <div
                    key={book.id}
                    className="
                      p-4 bg-gray-700/50 border border-gray-600 rounded-lg
                      hover:border-gray-500 transition-colors duration-200
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                          <FaHeart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-white mb-1">{book.title}</h4>
                          <p className="text-gray-400 text-sm">by {book.author}</p>
                          <div className="flex items-center mt-2">
                            <span className={`
                              inline-block px-2 py-1 rounded-full text-xs font-medium
                              ${book.available 
                                ? 'text-green-400 bg-green-500/10' 
                                : 'text-red-400 bg-red-500/10'
                              }
                            `}>
                              {book.available ? 'Available' : 'Not Available'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-x-2">
                        {book.available ? (
                          <button 
                            onClick={() => handleBookAction(book, 'borrow')}
                            className="
                              px-4 py-2 bg-gradient-to-r from-green-500 to-green-600
                              hover:from-green-600 hover:to-green-700 text-white rounded-lg
                              text-sm font-medium transition-all duration-200
                            "
                          >
                            Borrow
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleBookAction(book, 'reserve')}
                            className="
                              px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg
                              text-sm font-medium transition-all duration-200
                            "
                          >
                            Reserve
                          </button>
                        )}
                        <button className="text-red-400 hover:text-red-300 text-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recommended Tab */}
            {activeTab === 'recommended' && (
              <div className="space-y-4">
                {recommendedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="
                      p-4 bg-gray-700/50 border border-gray-600 rounded-lg
                      hover:border-gray-500 transition-colors duration-200
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded flex items-center justify-center">
                          <FaBook className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-white mb-1">{book.title}</h4>
                          <p className="text-gray-400 text-sm">by {book.author}</p>
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium text-purple-400 bg-purple-500/10 mt-2">
                            {book.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-x-2">
                        <button className="
                          px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600
                          hover:from-blue-600 hover:to-blue-700 text-white rounded-lg
                          text-sm font-medium transition-all duration-200
                        ">
                          Add to Wishlist
                        </button>
                        <button 
                          onClick={() => handleBookAction(book, 'borrow')}
                          className="
                            px-4 py-2 bg-gradient-to-r from-green-500 to-green-600
                            hover:from-green-600 hover:to-green-700 text-white rounded-lg
                            text-sm font-medium transition-all duration-200
                          "
                        >
                          Borrow
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;