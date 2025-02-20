export default function PostCard({ post }) {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{post.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={post.user.avatar} 
                className="h-8 w-8 rounded-full"
                alt={post.user.name}
              />
              <span className="text-sm">{post.user.name}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 text-gray-600 hover:text-red-500">
                <HeartIcon className="h-5 w-5" />
                <span>{post.likes}</span>
              </button>
              <button className="text-gray-600 hover:text-blue-500">
                <BookmarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }