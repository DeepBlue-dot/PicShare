import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import Spinner from '../components/Spinner'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const limit = 12
  const { isAuthenticated } = useAuth()

 const fetchPosts = async (pageNumber = 1, isLoadMore = false) => {
  try {
    isLoadMore ? setIsLoadingMore(true) : setIsLoading(true)
    setError(null)

    const URL = `http://127.0.0.1:8080/api/posts?page=${pageNumber}&limit=${limit}`

    const response = await axios.get(URL, { withCredentials: true })

    const { data, total } = response.data
    setPosts([])
    setTotalPosts(total)
    setPage(pageNumber + 1)
  } catch (err) {
    setError(err.message)
  } finally {
    isLoadMore ? setIsLoadingMore(false) : setIsLoading(false)
  }
}
  useEffect(() => {
    fetchPosts()
  }, [])

  const handleRetry = () => {
    fetchPosts()
  }

  const hasMorePosts = posts.length < totalPosts

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <div className="max-w-md p-4">
          <h2 className="text-xl font-bold mb-4 text-red-600">Error loading posts</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="px-4 md:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: limit }).map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-xl" />
              <div className="h-4 bg-gray-200 rounded mt-2 w-3/4" />
              <div className="h-4 bg-gray-200 rounded mt-1 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 md:px-8 py-8">
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </motion.div>

      {posts.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          {isAuthenticated ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto"
            >
              <h2 className="text-2xl font-bold mb-4">No posts found</h2>
              <p className="mb-6">Start sharing your ideas with the community!</p>
              <a
                href="/create-post"
                className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full"
              >
                Create Your First Post
              </a>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold mb-4">Welcome to PinClone</h2>
              <p>Login to discover amazing content</p>
            </motion.div>
          )}
        </div>
      ) : (
        hasMorePosts && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchPosts(page, true)}
              disabled={isLoadingMore}
              className="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded-full flex items-center gap-2"
            >
              {isLoadingMore ? (
                <>
                  <Spinner size="sm" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )
      )}
    </div>
  )
}