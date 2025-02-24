// SaveButton.jsx
import { BookmarkIcon as OutlineBookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/24/solid';

const SaveButton = ({ saved, onClick, disabled }) => {
  const handleClick = () => {
    if (!disabled) onClick();
  };

  return (
    <button
      className={`save-button ${saved ? 'saved' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {saved ? (
        <SolidBookmarkIcon className="h-6 w-6" />
      ) : (
        <OutlineBookmarkIcon className="h-6 w-6" />
      )}
      <span className="label">{saved ? 'Saved' : 'Save'}</span>
    </button>
  );
};

export default SaveButton;
