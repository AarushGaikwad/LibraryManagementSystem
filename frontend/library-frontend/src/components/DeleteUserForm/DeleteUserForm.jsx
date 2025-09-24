import { useEffect, useState } from "react";
import { usersAPI } from "../../services/api";

const DeleteUserForm = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersAPI.getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users by role
  useEffect(() => {
    if (selectedRole === "ALL") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === selectedRole));
    }
  }, [selectedRole, users]);

  // Get unique roles for filter options
  const availableRoles = [...new Set(users.map(user => user.role))];

  // Get role color for visual distinction
  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "TEACHER":
        return "bg-blue-100 text-blue-800";
      case "STUDENT":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  // Delete user function
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setDeletingUserId(userToDelete.id);
      await usersAPI.delete(userToDelete.id);
      
      // Remove deleted user from state
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      setShowConfirmModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Please try again.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-white text-xl font-bold">Delete Users</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors duration-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Filter Section */}
            <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex items-center space-x-4">
                <label className="text-gray-700 font-medium">Filter by Role:</label>

                <div className="relative">
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium 
                            focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none cursor-pointer shadow-sm"
                >
                    <option value="ALL">All Roles ({users.length})</option>
                    {availableRoles.map((role) => (
                    <option key={role} value={role}>
                        {role} ({users.filter(u => u.role === role).length})
                    </option>
                    ))}
                </select>

                {/* Dropdown arrow */}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                </div>

                </div>
            </div>


          {/* Content */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <span className="ml-3 text-gray-600">Loading users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">👥</div>
                <p className="text-gray-600">
                  {selectedRole === "ALL" ? "No users found." : `No ${selectedRole.toLowerCase()}s found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-sm">
                            {user.username && user.username.length > 0 ? user.username.charAt(0).toUpperCase() : '?'}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold text-lg">{user.name || 'Unknown User'}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        deletingUserId === user.id
                          ? "bg-gray-300 cursor-not-allowed text-gray-500"
                          : "bg-red-500 hover:bg-red-600 text-white hover:shadow-lg transform hover:scale-105"
                      }`}
                      onClick={() => handleDeleteClick(user)}
                      disabled={deletingUserId === user.id}
                    >
                      {deletingUserId === user.id ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                          <span>Deleting...</span>
                        </div>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-60">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Confirm Deletion
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <strong>{userToDelete.username}</strong>?
                <br />
                <span className="text-sm text-red-600">This action cannot be undone.</span>
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteUserForm;