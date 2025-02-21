// components/PostCard.jsx
import { HeartIcon, BookmarkIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PostCard({ post }) {
  const { user } = useAuth()
  const isLiked = user ? post.likes.includes(user._id) : false
  const isSaved = user ? user.savedPosts.includes(post._id) : false

  return (
    <div className="break-inside-avoid-column mb-6 hover:opacity-90 transition-opacity duration-200">
      <div className="relative group rounded-xl overflow-hidden shadow-lg">
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full object-cover cursor-zoom-in"
          style={{ minHeight: '200px', maxHeight: '600px' }}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
          <div className="flex justify-end gap-2">
            <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20">
              {isLiked ? (
                <HeartSolidIcon className="w-6 h-6 text-red-500" />
              ) : (
                <HeartIcon className="w-6 h-6 text-white" />
              )}
              <span className="sr-only">{post.likes.length} likes</span>
            </button>
            <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20">
              {isSaved ? (
                <BookmarkSolidIcon className="w-6 h-6 text-primary" />
              ) : (
                <BookmarkIcon className="w-6 h-6 text-white" />
              )}
              <span className="sr-only">Save</span>
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <Link 
              to={`/user/${post.createdBy._id}`}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full"
            >
              <img 
                src={post.createdBy.profilePicture} 
                className="w-8 h-8 rounded-full object-cover"
                alt={post.createdBy.username}
              />
              <span className="text-white font-medium">
                {post.createdBy.username}
              </span>
            </Link>
            
            <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20">
              <ChatBubbleOvalLeftIcon className="w-6 h-6 text-white" />
              <span className="sr-only">{post.comments.length} comments</span>
            </button>
          </div>
        </div>
      </div>

      {/* Caption */}
      {post.title && (
        <div className="mt-2 px-2">
          <h3 className="font-semibold line-clamp-2">{post.title}</h3>
          {post.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
          )}
        </div>
      )}
    </div>
  )
}