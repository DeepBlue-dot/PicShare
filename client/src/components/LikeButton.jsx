// LikeButton.jsx
import React from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

const LikeButton = ({ count, liked, onClick, disabled }) => {
  const handleClick = () => {
    if (!disabled) onClick();
  };

  return (
    <button 
      className={`like-button ${liked ? 'liked' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {liked ? <FaHeart /> : <FaRegHeart />}
      <span className="count">{count}</span>
    </button>
  );
};

export default LikeButton;