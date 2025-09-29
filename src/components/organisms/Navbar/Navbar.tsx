import React, { useState, useRef, useEffect } from "react";
import NavLinks from "../../molecules/NavLinks/NavLinks";
import { Link } from "react-router-dom";
import { Button } from "../../atoms/Button/Button";
import { useAuth } from "../../../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    } else if (user?.userName) {
      return user.userName.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getRoleLabel = () => {
    const roleMap: Record<string, string> = {
      STUDENT: "Student",
      COMPANY: "Company",
      ADMIN: "Admin",
    };
    return roleMap[user?.role ?? ""] ?? "Unknown role";
  };

  return (
    <nav className="flex justify-between items-center px-4 sm:px-10 py-4 bg-[#FFF0D9] border-b border-[#F3D94B]">
      <div className="w-[102px]"></div>
      <div className="flex-1 flex justify-center">
        <NavLinks />
      </div>

      <div className="hidden md:flex items-center gap-3 w-[220px] justify-end">
        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            {/* Avatar circle */}
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold focus:outline-none hover:bg-blue-700 transition-colors"
            >
              {getInitials()}
            </button>
            
            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-700">
                    {user.fullName || user.userName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Role: <span className="font-medium text-gray-700">{getRoleLabel()}</span>
                  </p>
                </div>
                
                <Link 
                  to="/profile" 
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Thông tin tài khoản
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="w-[102px] h-[44px] flex items-center justify-center">
              <Link to="/signin" className="w-full h-full">
                <Button
                  variant="secondary"
                  className="w-full h-full flex items-center justify-center text-black font-bold font-[700] leading-[28px] hover:text-yellow-400 transition-colors"
                >
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="w-[102px] h-[44px] rounded-[4px] border border-gray-300 flex items-center justify-center">
              <Link to="/signup" className="w-full h-full">
                <Button
                  variant="secondary"
                  className="w-full h-full rounded-[4px] flex items-center justify-center bg-black text-white font-bold font-[700] leading-[28px] hover:bg-yellow-400 hover:text-black transition-colors"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
