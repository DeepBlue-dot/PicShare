import { Link } from 'react-router-dom'

export default function TopBar() {
    const { user, isAuthenticated, logout } = useAuth()

  return (
    <div className="fixed top-0 left-20 right-0 h-16 bg-white shadow-sm flex items-center px-6 z-40">
      <div className="flex-1 max-w-3xl mx-auto">
        <input 
          type="text"
          placeholder="Search posts..."
          className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="ml-6 flex items-center">
        {isAuthenticated ? (
          <Link to="/profile" className="flex items-center">
            <img 
              src={user?.profilePicture || '/default-user.png'} 
              className="h-10 w-10 rounded-full object-cover"
              alt="Profile"
            />
          </Link>
        ) : (
          <Link 
            to="/auth"
            className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  )
}