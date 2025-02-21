import { useState, useEffect } from "react";
import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

export default function PostCard({ post, onLike, onSave }) {
  const { user } = useAuth();
  const postId = post.id || post._id;

  const [optimisticLiked, setOptimisticLiked] = useState(post.likes);
  const [optimisticSaved, setOptimisticSaved] = useState(post.saved);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isHovered, setIsHovered] = useState(false);

  // Re-sync if the post likes change or if the user changes.
  useEffect(() => {
    setOptimisticLiked(post.likes);
  }, [post.like]);

  // Re-sync if the user's saved posts or the post ID change.
  useEffect(() => {
    setOptimisticSaved(post.saved);
  }, [post.saved]);

  const handleLike = async () => {
    if (!user) return;

    const originalLiked = optimisticLiked;
    const originalLikeCount = likeCount;

    try {
      setOptimisticLiked(!originalLiked);
      setLikeCount(
        originalLiked ? originalLikeCount - 1 : originalLikeCount + 1
      );
      await api.post(`/posts/${postId}/like`);
      onLike?.(postId, !originalLiked);
    } catch (error) {
      setOptimisticLiked(originalLiked);
      setLikeCount(originalLikeCount);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    const originalSaved = optimisticSaved;

    try {
      setOptimisticSaved(!originalSaved);
      await api.post(`/posts/${postId}/save`);
      onSave?.(postId, !originalSaved);
    } catch (error) {
      setOptimisticSaved(originalSaved);
    }
  };

  return (
    <div className="break-inside-avoid-column mb-6 hover:opacity-90 transition-opacity duration-200">
      <div
        className="relative group rounded-xl overflow-hidden shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(!isHovered)}
      >
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover cursor-zoom-in aspect-square"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/default-post.jpg";
            e.target.onerror = null;
          }}
        />

        {(isHovered || window.innerWidth < 640) && (
          <div className="absolute inset-0 bg-black/50 p-4 flex flex-col justify-between transition-opacity">
            <div className="flex justify-end gap-2">
              <button
                onClick={handleLike}
                aria-label={optimisticLiked ? "Unlike post" : "Like post"}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              >
                {optimisticLiked ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-white" />
                )}
                <span className="sr-only">{likeCount} likes</span>
              </button>
              <button
                onClick={handleSave}
                aria-label={optimisticSaved ? "Unsave post" : "Save post"}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              >
                {optimisticSaved ? (
                  <BookmarkSolidIcon className="w-6 h-6 text-primary" />
                ) : (
                  <BookmarkIcon className="w-6 h-6 text-white" />
                )}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <Link
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/20"
              >
                <img
                  src={post.createdBy?.profilePicture || "/default-avatar.jpg"}
                  className="w-8 h-8 rounded-full object-cover"
                  alt={post.createdBy?.username}
                  onError={(e) => {
                    e.target.src = "/default-avatar.jpg";
                    e.target.onerror = null;
                  }}
                />
                <span className="text-white font-medium">
                  {post.createdBy?.username || "Unknown user"}
                </span>
              </Link>

              <Link
                to={`/post/${postId}`}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20"
                aria-label={`View comments (${post.comments?.length || 0})`}
              >
                <ChatBubbleOvalLeftIcon className="w-6 h-6 text-white" />
                <span className="sr-only">
                  {post.comments?.length || 0} comments
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {(post.title || post.description) && (
        <div className="mt-2 px-2 space-y-1">
          {post.title && (
            <h3 className="font-semibold line-clamp-2">{post.title}</h3>
          )}
          {post.description && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {post.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
