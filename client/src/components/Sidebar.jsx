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
    <div className="fixed sm:left-0 sm:top-0 sm:h-screen sm:w-20 bottom-0 left-0 w-full h-20 flex sm:flex-col flex-row bg-white shadow-lg z-50">
      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="sm:absolute absolute sm:left-20 sm:top-14 bottom-20 left-4 dropdown-panel">
          <div className="ml-2 w-72 bg-white rounded-lg shadow-xl border transform transition-all duration-300 origin-left sm:origin-top-left origin-bottom-left">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-700">Notifications</h3>
            </div>
            <div className="p-4 text-gray-500">
              {/* Empty content for now */}
            </div>
          </div>
        </div>
      )}

      {/* Messages Dropdown */}
      {showMessages && (
        <div className="sm:absolute absolute sm:left-20 sm:top-32 bottom-20 left-4 dropdown-panel">
          <div className="ml-2 w-72 h-full bg-white rounded-lg shadow-xl border transform transition-all duration-300 origin-left sm:origin-top-left origin-bottom-left">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-700">Messages</h3>
            </div>
            <div className="p-4 text-gray-500">
              {/* Empty content for now */}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar Content */}
      <div className="flex-1 flex sm:flex-col flex-row items-center justify-center sm:py-4 sm:space-y-6 space-x-6 sm:space-x-0">
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

      {/* Settings Icon - Hidden on mobile */}
      <div className="hidden sm:block py-4 flex flex-col items-center">
        <button className="p-2 hover:bg-gray-100 rounded-full dropdown-trigger">
          <Link to="/updateProfile">
            <Cog6ToothIcon className="h-8 w-8 text-gray-700" />
          </Link>
        </button>
      </div>
    </div>
  );
}