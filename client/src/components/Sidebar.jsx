// components/Sidebar.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  PlusCircleIcon,
  BellIcon,
  ChatBubbleOvalLeftIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-trigger') && 
          !e.target.closest('.dropdown-panel')) {
        setShowNotifications(false);
        setShowMessages(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setShowMessages(false);
    setShowNotifications(!showNotifications);
  };

  const toggleMessages = () => {
    setShowNotifications(false);
    setShowMessages(!showMessages);
  };

  return (
    <div className="fixed md:left-0 md:top-0 bottom-0 w-full md:w-20 h-16 md:h-screen flex flex-row md:flex-col bg-white shadow-lg z-50">
      {/* Notifications Dropdown */}
      <div className={`absolute md:left-20 md:top-0 md:bottom-0 bottom-16 left-0 right-0 w-full md:w-96 dropdown-panel
        ${showNotifications ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'} 
        transition-all duration-300 ease-out`}>
        {showNotifications && (
          <div className="w-full md:w-96 h-full bg-white shadow-2xl transform transition-transform duration-300">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <BellIcon className="h-5 w-5" />
                Notifications
              </h3>
            </div>
            <div className="p-4 text-gray-500 h-[calc(100%-56px)] overflow-y-auto space-y-4">
              {/* Empty content */}
              <div className="animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Dropdown */}
      <div className={`absolute md:left-20 md:top-0 md:bottom-0 bottom-16 left-0 right-0 w-full md:w-96 dropdown-panel
        ${showMessages ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'} 
        transition-all duration-300 ease-out`}>
        {showMessages && (
          <div className="w-full md:w-96 h-full bg-white shadow-2xl transform transition-transform duration-300">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <ChatBubbleOvalLeftIcon className="h-5 w-5" />
                Messages
              </h3>
            </div>
            <div className="p-4 text-gray-500 h-[calc(100%-56px)] overflow-y-auto space-y-4">
              {/* Empty content */}
              <div className="animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Icons Container */}
      <div className="flex-1 flex md:flex-col flex-row items-center justify-center md:justify-start md:py-4 md:space-y-6 space-x-6 md:space-x-0">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full dropdown-trigger">
          <HomeIcon className="h-8 w-8 text-gray-700" />
        </Link>

        <Link to="/create-post" className="p-2 hover:bg-gray-100 rounded-full dropdown-trigger">
          <PlusCircleIcon className="h-8 w-8 text-gray-700" />
        </Link>

        <button 
          onClick={toggleNotifications}
          className="p-2 hover:bg-gray-100 rounded-full relative dropdown-trigger"
        >
          <BellIcon className="h-8 w-8 text-gray-700" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        <button 
          onClick={toggleMessages}
          className="p-2 hover:bg-gray-100 rounded-full dropdown-trigger"
        >
          <ChatBubbleOvalLeftIcon className="h-8 w-8 text-gray-700" />
        </button>
      </div>

      {/* Bottom Settings (Desktop) */}
      <div className="hidden md:flex py-4 flex-col items-center">
        <button className="p-2 hover:bg-gray-100 rounded-full dropdown-trigger">
          <Link to="/updateProfile">
            <Cog6ToothIcon className="h-8 w-8 text-gray-700" />
          </Link>
        </button>
      </div>

      {/* Mobile Settings */}
      <div className="md:hidden flex items-center justify-center p-2">
        <button className="hover:bg-gray-100 rounded-full dropdown-trigger">
          <Link to="/updateProfile">
            <Cog6ToothIcon className="h-8 w-8 text-gray-700" />
          </Link>
        </button>
      </div>
    </div>
  );
}