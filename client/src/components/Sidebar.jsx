// components/Sidebar.jsx
import { Link } from "react-router-dom";
import {
  HomeIcon,
  PlusCircleIcon,
  BellIcon,
  ChatBubbleOvalLeftIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <div className="fixed left-0 top-0 h-screen w-20 flex flex-col bg-white shadow-lg z-50">
      {/* Top Icons */}
      <div className="flex-1 flex flex-col items-center py-4 space-y-6">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full">
          <HomeIcon className="h-8 w-8 text-gray-700" />
        </Link>

        <Link to="/create-post" className="p-2 hover:bg-gray-100 rounded-full">
          <PlusCircleIcon className="h-8 w-8 text-gray-700" />
        </Link>

        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <BellIcon className="h-8 w-8 text-gray-700" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-full">
          <ChatBubbleOvalLeftIcon className="h-8 w-8 text-gray-700" />
        </button>
      </div>

      {/* Bottom Settings */}
      <div className="py-4 flex flex-col items-center ">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Link to="/updateProfile">
            <Cog6ToothIcon className="h-8 w-8 text-gray-700" />
          </Link>
        </button>
      </div>
    </div>
  );
}
