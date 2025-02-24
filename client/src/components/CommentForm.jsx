// CommentForm.jsx
import { useState } from 'react';

const CommentForm = ({ onSubmit, commented }) => {
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    onSubmit(commentText);
    setCommentText('');
    setError('');
  };

  if (commented) {
    return <div className="info-message">You've already commented on this post</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="form-group">
        <textarea
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value);
            setError('');
          }}
          placeholder="Write a comment..."
          rows="3"
        />
        {error && <div className="error-message">{error}</div>}
      </div>
      <button type="submit" className="submit-button">
        Post Comment
      </button>
    </form>
  );
};

export default CommentForm;