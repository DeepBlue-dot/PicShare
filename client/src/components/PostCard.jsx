import { useEffect, useState } from "react";
import PostService from "../services/PostService";
import UserService from "../services/UserService";
import {
  BookmarkIcon as BookmarkSolidIcon,
  HeartIcon as HeartSolidIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import {
  BookmarkIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PostCard = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await PostService.getPostById(postId);
        
        try {
          data.createdBy = await UserService.getUserById(data.createdBy);
        } catch (userError) {
          console.error("Error fetching user:", userError);
          data.createdBy = {
            id: "unknown",
            username: "Deleted User",
            profilePicture: null,
          };
        }

        setPost(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    const previousState = post;
    try {
      setPost(prev => ({
        ...prev,
        likes: {
          ...prev.likes,
          liked: !prev.likes.liked,
          count: prev.likes.liked ? prev.likes.count - 1 : prev.likes.count + 1,
        },
      }));
      await PostService.likePost(post.id);
    } catch (error) {
      console.error("Error liking post:", error);
      setPost(previousState);
    }
  };

  const handleSave = async () => {
    const previousState = post;
    try {
      setPost(prev => ({ ...prev, saved: !prev.saved }));
      await UserService.toggleSavePost(post.id);
    } catch (error) {
      console.error("Error saving post:", error);
      setPost(previousState);
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/500?text=Image+Not+Available";
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white shadow-md overflow-hidden">
        <Skeleton height={256} className="rounded-t-xl" />
        <div className="p-4">
          <Skeleton count={2} />
          <div className="flex items-center mt-4">
            <Skeleton circle width={32} height={32} />
            <Skeleton width={100} className="ml-2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white shadow-md p-6 text-center text-red-500">
        <ExclamationCircleIcon className="w-12 h-12 mx-auto mb-4" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="break-inside-avoid group relative rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
          loading="lazy"
        />

        <button
          onClick={handleSave}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white transition-colors"
          aria-label={post.saved ? "Unsave post" : "Save post"}
        >
          {post.saved ? (
            <BookmarkSolidIcon className="w-6 h-6 text-rose-500" />
          ) : (
            <BookmarkIcon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        {post.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4">
          {post.createdBy.profilePicture ? (
            <img
              src={post.createdBy.profilePicture}
              alt={post.createdBy.username}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => e.target.src = "https://via.placeholder.com/32"}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <UserCircleIcon className="w-5 h-5 text-white" />
            </div>
          )}
          <Link 
            to={`/profile/${post.createdBy.id}`}
            className="hover:underline truncate"
          >
            <span className="text-sm font-medium">
              {post.createdBy.username}
            </span>
          </Link>
        </div>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/tags/${tag}`}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-600 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 hover:text-rose-500 transition-colors"
              aria-label={post.likes.liked ? "Unlike post" : "Like post"}
            >
              {post.likes.liked ? (
                <HeartSolidIcon className="w-6 h-6 text-rose-500" />
              ) : (
                <HeartIcon className="w-6 h-6" />
              )}
              <span className="text-sm">{post.likes.count}</span>
            </button>

            <button 
              className="flex items-center gap-1 hover:text-blue-500 transition-colors"
              aria-label="Comments"
            >
              <ChatBubbleOvalLeftIcon className="w-6 h-6" />
              <span className="text-sm">{post.comments.count}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;