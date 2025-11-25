import React, { useState, useRef, useEffect } from "react";
import NavLinks from "../../molecules/NavLinks/NavLinks";
import { Link } from "react-router-dom";
import { Button } from "../../atoms/Button/Button";
import { useAuth } from "../../../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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
    } else if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="relative flex items-center px-4 sm:px-10 py-4 border-b border-[#F3D94B] bg-white">
      {/* Search Bar - Left */}
      <div className="flex-shrink-0">
        <div className="relative w-64">
          <div className={`relative flex items-center rounded-full bg-gray-100 transition-all duration-200 ${
            isSearchFocused ? 'bg-white shadow-md ring-2 ring-blue-500' : ''
          }`}>
            <div className="absolute left-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm trên trang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500 rounded-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <NavLinks />
      </div>

      <div className="flex-shrink-0 flex items-center gap-3 ml-auto">
        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold focus:outline-none hover:bg-blue-700 transition-colors"
            >
              {getInitials()}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                {/* Menu Items */}
                <div className="py-1">
                  <Link to="/profile" onClick={() => setShowDropdown(false)} className="block">
                    <Button
                      variant="unstyled"
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-none flex items-center gap-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Profile
                    </Button>
                  </Link>

                   <Link to="/settings" onClick={() => setShowDropdown(false)} className="block">
                    <Button
                      variant="unstyled"
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-none flex items-center gap-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
                      </svg>
                      Settings
                    </Button>
                  </Link>

                  {(user?.role === 'COMPANY' || user?.role === 'ADMIN') && (
                    <>
                      <Link to="/career-paths" onClick={() => setShowDropdown(false)} className="block">
                        <Button
                          variant="unstyled"
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-none flex items-center gap-3"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                          </svg>
                          Career Paths
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                <div className="border-t border-gray-100 my-1"></div>

                <div className="px-1">
                  <Button
                    variant="unstyled"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-100 rounded-none flex items-center gap-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Log out
                  </Button>
                </div>
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
