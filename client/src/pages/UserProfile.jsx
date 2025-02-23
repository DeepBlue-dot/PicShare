import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  PhotoIcon,
  BookmarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import UserService from "../services/UserService";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);

  // Fetch the user by id from the URL
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.getUserById(id);
        // Assuming the returned user is available on response.data
        setUser(response);
      } catch (error) {
        setUserError("Failed to load user");
      } finally {
        setUserLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  // Fetch the saved posts once the user is loaded
  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (user && user.savedPosts && user.savedPosts.length > 0) {
        console.log(user)
      } else {
        setPostsLoading(false);
      }
    };

    fetchSavedPosts();
  }, [user, id]);

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (userError || postsError) {
    return (
      <div className="text-center py-8 text-red-500">
        {userError || postsError}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="relative inline-block">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.username}
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-100">
              <span className="text-2xl font-bold text-indigo-600">
                {user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user.username}
          </h1>
          <p className="text-gray-600 mb-4">{user.email}</p>
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="h-5 w-5" />
              <span>{savedPosts.length} Saved Pins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Posts Grid */}
      {postsLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : savedPosts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <BookmarkIcon className="h-12 w-12 mx-auto mb-4" />
          <p>No saved posts yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {savedPosts.map((post) => (
            <Link
              to={`/posts/${post._id}`}
              key={post._id}
              className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover aspect-square"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                  <PhotoIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-white font-medium truncate">
                    {post.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
