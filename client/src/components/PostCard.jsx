import { useEffect, useState } from 'react';
import PostService from '../services/PostService';
import UserService from '../services/UserService';
// Import icons from Heroicons
import { BookmarkIcon as BookmarkSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon, HeartIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

const PostCard = ({ postId }) => {
  const [post, setPost] = useState(null);

  // Fetch the post data when the component mounts or when postId changes.
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = (await PostService.getPostById(postId)).data;
        // Fetch the complete createdBy user data if needed.
        data.createdBy = await UserService.getUser(data.createdBy);
        setPost(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  // While waiting for data, render a loading state.
  if (!post) {
    return <div>Loading...</div>;
  }

  const handleLike = async () => {
    try {
      await PostService.likePost(post.id);
      setPost((prev) => ({
        ...prev,
        likes: {
          ...prev.likes,
          liked: !prev.likes.liked,
          count: prev.likes.liked ? prev.likes.count - 1 : prev.likes.count + 1,
        },
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSave = async () => {
    try {
      await UserService.toggleSavePost(post.id);
      setPost((prev) => ({
        ...prev,
        saved: !prev.saved,
      }));
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <div className="break-inside-avoid group relative rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white transition-colors"
        >
          {post.saved ? (
            <BookmarkSolidIcon className="w-6 h-6 text-rose-500" />
          ) : (
            <BookmarkIcon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Content Container */}
      <div className="p-4">
        {/* Title & Description */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
        {post.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.description}</p>
        )}

        {/* User Info */}
        <div className="flex items-center gap-2 mb-4">
          {post.createdBy.profilePicture ? (
            <img
              src={post.createdBy.profilePicture}
              alt={post.createdBy.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium">
                {post.createdBy.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <span className="text-sm font-medium">{post.createdBy.username || 'Unknown'}</span>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 hover:text-rose-500 transition-colors"
            >
              {post.likes.liked ? (
                <HeartSolidIcon className="w-6 h-6 text-rose-500" />
              ) : (
                <HeartIcon className="w-6 h-6" />
              )}
              <span className="text-sm">{post.likes.count}</span>
            </button>
            
            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
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
