// DeleteUserForm.jsx
import { useEffect, useState } from "react";
import { usersAPI } from "../../services/api"; // make sure the path is correct

const DeleteUserForm = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersAPI.getAllUsers(); // getAll users
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete user function
  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      setDeletingUserId(id);
      await usersAPI.delete(id);
      // Remove deleted user from state
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Please try again.");
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg relative w-96 max-h-[80vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✖
        </button>

        <h2 className="text-white text-lg font-semibold mb-4">Delete Users</h2>

        {loading ? (
          <p className="text-gray-400">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-3 bg-gray-800 rounded hover:bg-gray-700 transition"
              >
                <div>
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <p className="text-gray-400 text-xs">Role: {user.role}</p>
                </div>
                <button
                  className={`px-3 py-1 rounded ${
                    deletingUserId === user.id
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white text-sm`}
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={deletingUserId === user.id}
                >
                  {deletingUserId === user.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteUserForm;
