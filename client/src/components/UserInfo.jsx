import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserService from "../services/UserService";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const UserInfo = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await UserService.getUserById(userId); // Fixed method name
        setUser(data);
        setError(null);
      } catch (err) {
        setError("Error loading user");
        // Set default user with proper avatar field
        setUser({
          id: "unknown",
          username: "Deleted User",
          avatar: null, // Changed from profilePicture to avatar
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div className="user-loading">Loading user...</div>;

  return (
    <div className="user-info">
      {user.profilePicture ? (
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => (e.target.src = "https://via.placeholder.com/32")}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <UserCircleIcon className="w-5 h-5 text-white" />
        </div>
      )}

      <Link
        to={`/profile/${user.id}`}
        className="hover:underline truncate"
      >
        <span className="text-sm font-medium">{user.username}</span>
      </Link>
    </div>
  );
};

export default UserInfo;
