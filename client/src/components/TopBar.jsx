import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TopBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  // Reset image error when profile picture changes
  useEffect(() => {
    setImageError(false);
  }, [user?.profilePicture]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial = user?.username?.charAt(0).toUpperCase() || "?";

  return (
    <div className="fixed top-0 left-20 right-0 h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center px-6 z-40">
      <div className="flex-1 max-w-3xl mx-auto relative">
        <label htmlFor="search" className="sr-only">
          Search posts
        </label>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          id="search"
          type="text"
          placeholder="Search posts..."
          className="w-full pl-11 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all"
        />
      </div>

      <div className="ml-6 flex items-center relative" ref={dropdownRef}>
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center h-10 w-10 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              {user?.profilePicture && !imageError ? (
                <img
                  src={user.profilePicture}
                  onError={() => setImageError(true)}
                  className="h-full w-full rounded-full object-cover object-center border-2 border-transparent hover:border-primary-500 transition-colors"
                  alt="Profile"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold border-2 border-transparent hover:border-primary-500 transition-colors">
                  {userInitial}
                </div>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-12 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 border dark:border-gray-700">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/auth"
            className="px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
