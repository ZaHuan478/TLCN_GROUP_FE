import React, { useState, useRef, useEffect } from "react";
import NavLinks from "../../molecules/NavLinks/NavLinks";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../atoms/Button/Button";
import { useAuth } from "../../../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, refreshUser, unreadMessages, resetUnread, notifications, clearNotifications } = useAuth() as any;
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  

  // Refresh user data on mount to get latest avatar
  useEffect(() => {
    if (isAuthenticated && refreshUser) {
      refreshUser().catch((err: any) => console.error('Failed to refresh user:', err));
    }
  }, [isAuthenticated, refreshUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target) && showProfileDropdown) {
        setShowProfileDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(target) && showNotifDropdown) {
        setShowNotifDropdown(false);
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
      setShowProfileDropdown(false);
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

  // Debug: Log user avatar
  useEffect(() => {
    if (user) {
      console.log('Navbar user data:', { 
        id: user.id, 
        avatar: user.avatar, 
        fullName: user.fullName 
      });
    }
  }, [user]);

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
              <Button
                variant="unstyled"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 transition-colors p-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <NavLinks />
      </div>

      <div className="flex-shrink-0 flex items-center gap-3 ml-auto">
        {isAuthenticated && user ? (
          <div className="relative flex items-center" ref={profileRef}>
            <div className="mr-3 flex items-center relative" ref={notifRef}>
              <button
                title="Notifications"
                onClick={() => { setShowNotifDropdown((s) => !s); try { resetUnread && resetUnread(); } catch(e){} }}
                className="relative w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-semibold focus:outline-none hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                { (unreadMessages || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{unreadMessages}</span>
                ) }
              </button>

              {/** Notifications dropdown (small) */}
              {showNotifDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-md shadow-lg py-2 z-20 border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-700">You have {unreadMessages || 0} new message{(unreadMessages || 0) > 1 ? 's' : ''}.</div>
                  <div className="max-h-48 overflow-auto">
                    { (notifications && notifications.length > 0) ? (
                        notifications.map((n: any, idx: number) => (
                        <div key={idx} className="px-3 py-2 border-t text-sm cursor-pointer hover:bg-gray-50" onClick={() => { try { resetUnread && resetUnread(); clearNotifications && clearNotifications(); navigate(`/connections?conversationId=${n.conversationId}`); setShowNotifDropdown(false); } catch(e){} }}>
                          <div className="font-medium">{n.message?.sender?.fullName || n.message?.sender?.username || 'Someone'}</div>
                          <div className="text-xs text-gray-600 truncate">{n.message?.content}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">No new messages</div>
                    )}
                  </div>
                  <div className="px-2 py-2 border-t">
                    <button className="w-full text-left text-sm text-blue-600 px-3 py-1 hover:bg-gray-50" onClick={() => { try { resetUnread && resetUnread(); clearNotifications && clearNotifications(); navigate('/connections'); setShowNotifDropdown(false); } catch(e){} }}>
                      View messages
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold focus:outline-none hover:bg-blue-700 transition-colors"
              >
                {getInitials()}
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <Link to="/profile" onClick={() => setShowProfileDropdown(false)}>
                    <Button
                      variant="unstyled"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-none flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Profile
                    </Button>
                  </Link>

                  <Link to="/settings" onClick={() => setShowProfileDropdown(false)}>
                    <Button
                      variant="unstyled"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-none flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
                      </svg>
                      Settings
                    </Button>
                  </Link>

                  <Button
                    variant="unstyled"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-none flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Log out
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="w-[102px] h-[44px] flex items-center justify-center">
              <Link to="/signin" className="w-full h-full">
                <Button
                  variant="secondary"
                  className="w-full h-full flex items-center justify-center text-black font-bold leading-[28px] hover:text-yellow-400 transition-colors"
                >
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="w-[102px] h-[44px] rounded-[4px] border border-gray-300 flex items-center justify-center">
              <Link to="/signup" className="w-full h-full">
                <Button
                  variant="secondary"
                  className="w-full h-full rounded-[4px] flex items-center justify-center bg-black text-white font-bold leading-[28px] hover:bg-yellow-400 hover:text-black transition-colors"
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
