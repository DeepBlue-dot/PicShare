import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  PhotoIcon,
  BookmarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import UserService from "../services/UserService";
import PostService from "../services/PostService";
import Masonry from "react-masonry-css";
import PostCard from "../components/PostCard";
import { motion } from "framer-motion";


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
        try {
          const posts = await Promise.all(
            user.savedPosts.map(async(postId) => (await PostService.getPostById(postId)).data)
          );
          setSavedPosts(posts);
        } catch (error) {
          console.error("Error fetching saved posts:", error);
        } finally {
          setPostsLoading(false);
        }
      } else {
        setPostsLoading(false);
      }
    };
  
    fetchSavedPosts();
  }, [user]);
  

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
        <div className="container mx-auto px-4 py-8">
      <Masonry
        className="flex gap-4"
        columnClassName="my-masonry-grid_column"
      >
        {savedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PostCard postId={post.id} />
          </motion.div>
        ))}
      </Masonry>

      {savedPosts.length === 0 && (
        <div className="text-center text-gray-500 text-xl mt-8">
          No posts found. Be the first to create one!
        </div>
      )}
    </div>
      )}
    </div>
  );
};

export default UserProfile;
