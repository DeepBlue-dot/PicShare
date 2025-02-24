// CommentsList.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const CommentsList = ({ comments, currentUserId }) => {
  if (!comments || comments.length === 0) {
    return <div className="no-comments">No comments yet</div>;
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <div 
          key={comment._id} 
          className={`comment-item ${comment.commentedBy._id === currentUserId ? 'own-comment' : ''}`}
        >
          <div className="comment-header">
            <span className="comment-author">{comment.commentedBy.username}</span>
            <span className="comment-time">
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </span>
          </div>
          <p className="comment-text">{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;