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
      setPost((prev) => ({
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
      setPost((prev) => ({ ...prev, saved: !prev.saved }));
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
    <div className="break-inside-avoid group relative rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]">
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="relative aspect-square overflow-hidden">
          <Link to={`/post/${post.id}`}>
            {" "}
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={handleImageError}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>

        <button
          onClick={handleSave}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-all duration-200 hover:scale-105"
          aria-label={post.saved ? "Unsave post" : "Save post"}
        >
          {post.saved ? (
            <BookmarkSolidIcon className="w-5 h-5 text-rose-500" />
          ) : (
            <BookmarkIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Link
            to={`/profile/${post.createdBy.id}`}
            className="shrink-0 hover:opacity-80 transition-opacity"
          >
            {post.createdBy.profilePicture ? (
              <img
                src={post.createdBy.profilePicture}
                alt={post.createdBy.username}
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/32")
                }
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <UserCircleIcon className="w-5 h-5 text-white/90" />
              </div>
            )}
          </Link>
          <div className="min-w-0">
            <Link
              to={`/profile/${post.createdBy.id}`}
              className="block font-medium text-sm truncate hover:text-gray-900 transition-colors"
            >
              {post.createdBy.username}
            </Link>
            <h3 className="text-xs font-normal text-gray-500 truncate">
              {post.title}
            </h3>
          </div>
        </div>

        {post.description && (
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
            {post.description}
          </p>
        )}

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/tags/${tag}`}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-600 transition-all duration-200 hover:-translate-y-0.5"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 group/like"
              aria-label={post.likes.liked ? "Unlike post" : "Like post"}
            >
              <div className="p-1.5 rounded-full group-hover/like:bg-rose-50 transition-colors">
                {post.likes.liked ? (
                  <HeartSolidIcon className="w-5 h-5 text-rose-500 animate-like" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-500 group-hover/like:text-rose-400 transition-colors" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-600">
                {post.likes.count}
              </span>
            </button>

            <button
              className="flex items-center gap-1.5 group/comment"
              aria-label="Comments"
            >
              <div className="p-1.5 rounded-full group-hover/comment:bg-blue-50 transition-colors">
                <ChatBubbleOvalLeftIcon className="w-5 h-5 text-gray-500 group-hover/comment:text-blue-400 transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                {post.comments.count}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS animations in your global styles
// @keyframes like {
//   0% { transform: scale(1); }
//   50% { transform: scale(1.2); }
//   100% { transform: scale(1); }
// }
// .animate-like { animation: like 0.4s ease-out; }

export default PostCard;
