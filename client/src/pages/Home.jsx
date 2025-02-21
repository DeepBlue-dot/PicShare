// pages/Home.jsx
import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/Spinner'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center mt-20 text-gray-500">
          {isAuthenticated ? (
            <>
              <h2 className="text-2xl font-bold mb-4">No posts found</h2>
              <p>Start by creating your first post!</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Welcome to PinClone</h2>
              <p>Login to see personalized content</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}