import { useState } from 'react';
import { 
  FaUserShield, 
  FaChalkboardTeacher, 
  FaGraduationCap, 
  FaBook, 
  FaUniversity 
} from 'react-icons/fa';
import LoginModal from '../components/LoginModal/LoginModal';
import { USER_ROLES, ROLE_CONFIG } from '../utils/constants';

const HomePage = () => {
  const [loginModal, setLoginModal] = useState({
    isOpen: false,
    selectedRole: null,
  });

  const handleRoleSelect = (role) => {
    setLoginModal({
      isOpen: true,
      selectedRole: role,
    });
  };

  const handleCloseModal = () => {
    setLoginModal({
      isOpen: false,
      selectedRole: null,
    });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return <FaUserShield className="w-8 h-8" />;
      case USER_ROLES.TEACHER:
        return <FaChalkboardTeacher className="w-8 h-8" />;
      case USER_ROLES.STUDENT:
        return <FaGraduationCap className="w-8 h-8" />;
      default:
        return <FaBook className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
              <FaUniversity className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            University Library
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to our digital library management system. 
            Please select your role to access your personalized portal.
          </p>
        </div>

        {/* Login Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {Object.values(USER_ROLES).map((role) => {
            const config = ROLE_CONFIG[role];
            return (
              <div
                key={role}
                className="group cursor-pointer"
                onClick={() => handleRoleSelect(role)}
              >
                <div className={`
                  relative p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700
                  rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300
                  group-hover:border-gray-600 group-hover:bg-gray-800/70
                  transform group-hover:-translate-y-2
                `}>
                  {/* Gradient Background */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-r ${config.color} 
                    opacity-0 group-hover:opacity-10 rounded-2xl 
                    transition-opacity duration-300
                  `} />
                  
                  {/* Content */}
                  <div className="relative z-10 text-center space-y-4">
                    {/* Icon */}
                    <div className={`
                      inline-flex p-4 rounded-xl bg-gradient-to-r ${config.color}
                      text-white shadow-lg group-hover:shadow-xl
                      transform group-hover:scale-110 transition-all duration-300
                    `}>
                      {getRoleIcon(role)}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-semibold text-white group-hover:text-gray-100">
                      {config.title.replace(' Login', '')}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                      {config.description}
                    </p>
                    
                    {/* Action Text */}
                    <div className="pt-2">
                      <span className={`
                        inline-block px-4 py-2 rounded-lg text-sm font-medium
                        bg-gray-700 text-gray-300 group-hover:bg-gradient-to-r
                        group-hover:${config.color} group-hover:text-white
                        transition-all duration-300
                      `}>
                        Click to Login
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            © 2024 University Library Management System
          </p>
          <p className="text-gray-600 text-xs">
            Secure • Reliable • Efficient
          </p>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModal.isOpen}
        onClose={handleCloseModal}
        selectedRole={loginModal.selectedRole}
      />
    </div>
  );
};

export default HomePage;