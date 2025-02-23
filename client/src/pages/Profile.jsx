import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PhotoIcon, BookmarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth();
  const [savedPosts, setSavedPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (user?.savedPosts?.length > 0) {
        try {
          const { data } = await axios.get(`${URL}/api/users/me/saved-posts`, {
            withCredentials: true,
          });
          setSavedPosts(data.data.posts);
        } catch (error) {
          setPostsError('Failed to load saved posts');
        } finally {
          setPostsLoading(false);
        }
      } else {
        setPostsLoading(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchSavedPosts();
    }
  }, [user, isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || postsError) {
    return (
      <div className="text-center py-8 text-red-500">
        {error?.message || postsError}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <img
          src={user?.profilePicture}
          alt={user?.username}
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          onError={(e) => {
            e.target.src = 'https://res.cloudinary.com/dt5ul7aww/image/upload/v1739269736/cvgdfcqjdfjsdsdv01f6.jpg';
          }}
        />
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user?.username}
          </h1>
          <p className="text-gray-600 mb-4">{user?.email}</p>
          
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
                  <h3 className="text-white font-medium truncate">{post.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;