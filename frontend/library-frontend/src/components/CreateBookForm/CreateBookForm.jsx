import { useState, useEffect } from "react";
import { booksAPI } from "../../services/api";

const CreateBookForm = ({ onClose, onBookCreated }) => {
  // State management
  const [formData, setFormData] = useState({
    title: "",
    author: ""
  });
  
  const [formState, setFormState] = useState({
    loading: false,
    error: "",
    success: false,
    showSuccessMessage: false
  });

  // Basic frontend validation (UX improvement)
  const validateForm = () => {
    const { title, author } = formData;
    
    if (!title.trim()) {
      return "Title is required";
    }
    
    if (!author.trim()) {
      return "Author is required";
    }
    
    return null; // No errors
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formState.error) {
      setFormState(prev => ({
        ...prev,
        error: ""
      }));
    }
  };

  // Success message auto-hide effect
  useEffect(() => {
    if (formState.showSuccessMessage) {
      const timer = setTimeout(() => {
        setFormState(prev => ({
          ...prev,
          showSuccessMessage: false
        }));
        onClose(); // Close form after showing success message
      }, 2000); // Hide after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [formState.showSuccessMessage, onClose]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic frontend validation
    const validationError = validateForm();
    if (validationError) {
      setFormState(prev => ({
        ...prev,
        error: validationError
      }));
      return;
    }

    // Set loading state
    setFormState({
      loading: true,
      error: "",
      success: false,
      showSuccessMessage: false
    });

    try {
      // Prepare clean data for API
      const cleanFormData = {
        title: formData.title.trim(),
        author: formData.author.trim()
      };

      await booksAPI.create(cleanFormData);
      
      // Reset form and show success
      setFormData({ title: "", author: "" });
      setFormState({
        loading: false,
        error: "",
        success: true,
        showSuccessMessage: true
      });

      // Call parent callback if provided
      if (onBookCreated) {
        onBookCreated();
      }

    } catch (err) {
      console.error("Book creation error:", err);
      
      // Handle different types of errors professionally
      let errorMessage = "Failed to create book";
      
      if (err.response) {
        // Backend validation or server errors
        if (err.response.status === 400) {
          errorMessage = err.response.data?.message || "Invalid book data provided";
        } else if (err.response.status === 409) {
          errorMessage = "Book with this title already exists";
        } else if (err.response.status >= 500) {
          errorMessage = "Server error. Please try again later";
        }
      } else if (err.request) {
        // Network errors
        errorMessage = "Network error. Please check your connection";
      }
      
      setFormState({
        loading: false,
        error: errorMessage,
        success: false,
        showSuccessMessage: false
      });
    }
  };

  // Success Toast Component
  const SuccessToast = () => (
    <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 z-50 animate-slide-in border border-green-400/30">
      <div className="bg-white/20 rounded-full p-1">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <div className="font-semibold">Success!</div>
        <div className="text-sm opacity-90">Book created successfully</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Success Toast */}
      {formState.showSuccessMessage && <SuccessToast />}
      
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700/50">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Book</h2>
            <p className="text-gray-400 text-sm">Expand your library collection</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-300 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Book Title</span>
              <span className="text-red-400 text-sm">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={formState.loading}
                required
                className={`
                  w-full px-4 py-3 rounded-xl bg-gray-900/50 text-white border-2 
                  transition-all duration-300 placeholder-gray-500
                  focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none
                  ${formState.loading 
                    ? 'border-gray-600 cursor-not-allowed opacity-60' 
                    : 'border-gray-600 hover:border-gray-500'
                  }
                  ${formData.title ? 'border-blue-500/50' : ''}
                `}
                placeholder="Enter the book title..."
              />
              {formData.title && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          {/* Author Input */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-300 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Author Name</span>
              <span className="text-red-400 text-sm">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                disabled={formState.loading}
                required
                className={`
                  w-full px-4 py-3 rounded-xl bg-gray-900/50 text-white border-2 
                  transition-all duration-300 placeholder-gray-500
                  focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none
                  ${formState.loading 
                    ? 'border-gray-600 cursor-not-allowed opacity-60' 
                    : 'border-gray-600 hover:border-gray-500'
                  }
                  ${formData.author ? 'border-blue-500/50' : ''}
                `}
                placeholder="Enter the author's name..."
              />
              {formData.author && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {formState.error && (
            <div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-red-500/20 rounded-full p-2">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-red-300 font-medium text-sm">Error</div>
                  <div className="text-red-400 text-sm">{formState.error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-center space-x-3 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              disabled={formState.loading}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200 
                ${formState.loading
                  ? 'bg-gray-600 cursor-not-allowed opacity-60'
                  : 'bg-gray-700 hover:bg-gray-600 hover:shadow-md'
                } text-white border border-gray-600
              `}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={formState.loading}
              className={`
                px-5 py-2 rounded-lg font-medium transition-all duration-200 
                flex items-center space-x-2 border-2
                ${formState.loading
                  ? 'bg-blue-600 border-blue-500 cursor-not-allowed opacity-80'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-blue-400 hover:shadow-lg hover:scale-105'
                } text-white
              `}
            >
              {formState.loading && (
                <div className="relative">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              <span>{formState.loading ? "Creating..." : "Create Book"}</span>
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </>
  );
};

export default CreateBookForm;