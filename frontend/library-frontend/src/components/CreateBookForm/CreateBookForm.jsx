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
    <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-slide-in">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="font-medium">Book created successfully!</span>
    </div>
  );

  return (
    <>
      {/* Success Toast */}
      {formState.showSuccessMessage && <SuccessToast />}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Add New Book</h2>

        <div>
          <label className="block text-gray-300 mb-1">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={formState.loading}
            required
            className={`w-full p-2 rounded bg-gray-800 text-white border transition-colors ${
              formState.loading 
                ? 'border-gray-500 cursor-not-allowed opacity-70' 
                : 'border-gray-600 focus:border-blue-500 focus:outline-none'
            }`}
            placeholder="Enter book title"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">
            Author <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            disabled={formState.loading}
            required
            className={`w-full p-2 rounded bg-gray-800 text-white border transition-colors ${
              formState.loading 
                ? 'border-gray-500 cursor-not-allowed opacity-70' 
                : 'border-gray-600 focus:border-blue-500 focus:outline-none'
            }`}
            placeholder="Enter author name"
          />
        </div>

        {/* Error Message */}
        {formState.error && (
          <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-900/20 p-2 rounded">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{formState.error}</span>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={formState.loading}
            className={`px-4 py-2 rounded transition-colors ${
              formState.loading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700'
            } text-white`}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={formState.loading}
            className={`px-4 py-2 rounded transition-colors flex items-center space-x-2 ${
              formState.loading
                ? 'bg-blue-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {formState.loading && (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{formState.loading ? "Creating..." : "Create Book"}</span>
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CreateBookForm;