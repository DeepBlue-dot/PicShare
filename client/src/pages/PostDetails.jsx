import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentForm from '../components/CommentForm';
import CommentsList from '../components/CommentsList';
import UserInfo from '../components/UserInfo';
import LikeButton from '../components/LikeButton';
import SaveButton from '../components/SaveButton';
import { useEffect, useState } from 'react';
import PostService from '../services/PostService';
import { formatDistanceToNow } from 'date-fns';

const PostDetail = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await PostService.getPostById(postId);
        setPost(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [postId, user?.id]);

  const handleLike = async () => {
    try {
      const updatedPost = await api.patch(`/posts/${postId}/toggle-like`);
      setPost(prev => ({
        ...prev,
        ...updatedPost.data,
        likes: updatedPost.data.likes
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating like');
    }
  };

  const handleCommentSubmit = async (commentText) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, {
        text: commentText
      });
      setPost(prev => ({
        ...prev,
        comments: response.data.comments,
        commentsCount: response.data.comments.length
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding comment');
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.patch(`/users/toggle-save-post/${postId}`);
      setPost(prev => ({
        ...prev,
        saved: response.data.saved
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving post');
    }
  };
  
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
        {error}
      </div>
    </div>
  );

  if (!post) return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="text-center text-gray-600 text-xl">Post not found</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Post Header */}
      <div className="flex justify-between items-start mb-6">
        <UserInfo userId={post.createdBy} />
        <div className="text-sm text-gray-500 space-y-1">
          <div>
            Posted {formatDistanceToNow(new Date(post.createdAt))} ago
          </div>
          {post.updatedAt && (
            <div>
              Updated {formatDistanceToNow(new Date(post.updatedAt))} ago
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <article className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        {post.description && (
          <p className="text-gray-700 text-lg mb-6">{post.description}</p>
        )}
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-auto rounded-lg shadow-lg mb-6"
        />
        
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Actions */}
      <div className="flex gap-4 mb-8">
        <LikeButton 
          count={post.likes.count} 
          liked={post.likes.liked} 
          onClick={handleLike}
          disabled={!user}
        />
        <SaveButton 
          saved={post.saved} 
          onClick={handleSave}
          disabled={!user}
        />
      </div>

      {/* Comments Section */}
      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-6">
          Comments ({post.comments.count})
        </h2>

        {user && (
          <div className="mb-8">
            <CommentForm 
              onSubmit={handleCommentSubmit}
              commented={post.comments.commented}
            />
          </div>
        )}

        <CommentsList 
          comments={post.comments.comments} 
          currentUserId={user?.id}
        />
      </section>
    </div>
  );
};

export default PostDetail;