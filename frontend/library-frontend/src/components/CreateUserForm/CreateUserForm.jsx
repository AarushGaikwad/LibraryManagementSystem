import { useState } from "react";
import { usersAPI } from "../../services/api";

const CreateUserForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    designation: "",
    department: "",
    yearOfStudy: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await usersAPI.create(formData);
      setMessage("User created successfully!");
      setMessageType("success");
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "",
        designation: "",
        department: "",
        yearOfStudy: "",
      });
    } catch (err) {
      setMessage("Failed to create user.");
      setMessageType("error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 transform transition-all p-8 
                      max-h-[80vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create User</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-blue-400 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-blue-400 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-blue-400 outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              User Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-blue-400 outline-none"
            >
              <option value="">Select Role</option>
              <option value="TEACHER">Teacher</option>
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Teacher fields */}
          {formData.role === "TEACHER" && (
            <div className="transition-all duration-500 ease-in-out">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-blue-400 outline-none"
                />
              </div>
            </div>
          )}

          {/* Student fields */}
          {formData.role === "STUDENT" && (
            <div className="transition-all duration-500 ease-in-out">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Year of Study
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-blue-400 outline-none"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Create User
          </button>
        </form>

        {/* Success/Error message */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-lg border ${
              messageType === "success"
                ? "border-green-500 text-green-400"
                : "border-red-500 text-red-400"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUserForm;
