import { useState } from "react";
import { usersAPI } from "../../services/api";

const CreateUserForm = () => {
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
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validRoles = ["ADMIN", "TEACHER", "STUDENT"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (message) { setMessage(""); setMessageType(""); }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!formData.role.trim()) newErrors.role = "Role is required";
    else if (!validRoles.includes(formData.role.toUpperCase())) newErrors.role = "Role must be ADMIN, TEACHER, or STUDENT";

    if (formData.role.toUpperCase() === "TEACHER") {
      if (!formData.designation.trim()) newErrors.designation = "Designation is required";
      if (!formData.department.trim()) newErrors.department = "Department is required";
    }

    if (formData.role.toUpperCase() === "STUDENT") {
      if (!formData.department.trim()) newErrors.department = "Department is required";
      if (!formData.yearOfStudy) newErrors.yearOfStudy = "Year of study is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const payload = {
        ...formData,
        role: formData.role.toUpperCase(),
        yearOfStudy: formData.yearOfStudy ? parseInt(formData.yearOfStudy, 10) : null,
      };

      await usersAPI.create(payload);

      setMessage("User created successfully!");
      setMessageType("success");

      setFormData({ username: "", email: "", password: "", role: "", designation: "", department: "", yearOfStudy: "" });
      setErrors({});
    } catch (err) {
      console.error("Create user error:", err);
      setMessage(err.message || "Failed to create user. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Create New User</h2>
        <p className="text-blue-100 text-sm mt-1">Add a new user to the system</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Username *</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.username ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              disabled={isLoading}
            />
            {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.password ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.042.168-2.044.48-2.985m3.4-3.4A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10 0 1.042-.168 2.044-.48 2.985m-3.4 3.4L4.98 4.98" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">User Role *</label>
            <input
              type="text"
              name="role"
              placeholder="Enter role (ADMIN, TEACHER, STUDENT)"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.role ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              disabled={isLoading}
            />
            {errors.role && <p className="text-red-600 text-xs mt-1">{errors.role}</p>}
          </div>

          {/* Teacher Fields */}
          {formData.role.toUpperCase() === "TEACHER" && (
            <>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Designation *</label>
                <input
                  type="text"
                  name="designation"
                  placeholder="Enter designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.designation ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  disabled={isLoading}
                />
                {errors.designation && <p className="text-red-600 text-xs mt-1">{errors.designation}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Department *</label>
                <input
                  type="text"
                  name="department"
                  placeholder="Enter department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.department ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  disabled={isLoading}
                />
                {errors.department && <p className="text-red-600 text-xs mt-1">{errors.department}</p>}
              </div>
            </>
          )}

          {/* Student Fields */}
          {formData.role.toUpperCase() === "STUDENT" && (
            <>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Department / Branch *</label>
                <input
                  type="text"
                  name="department"
                  placeholder="Enter department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.department ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  disabled={isLoading}
                />
                {errors.department && <p className="text-red-600 text-xs mt-1">{errors.department}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Year of Study *</label>
                <input
                  type="number"
                  name="yearOfStudy"
                  placeholder="Enter year of study"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.yearOfStudy ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  disabled={isLoading}
                />
                {errors.yearOfStudy && <p className="text-red-600 text-xs mt-1">{errors.yearOfStudy}</p>}
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating User...
              </div>
            ) : (
              "Create User"
            )}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg border ${
            messageType === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <div className="flex items-center">
              {messageType === "success" ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUserForm;
