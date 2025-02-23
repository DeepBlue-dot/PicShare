import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import PostCard from "../components/PostCard";
import PostService from "../services/PostService";
import Spinner from "../components/Spinner"; // Assume you have a Spinner component

const HomePage = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Masonry breakpoint columns
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await PostService.getAllPosts();
        setPosts(data.data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="w-12 h-12 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4"
        columnClassName="my-masonry-grid_column"
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PostCard postId={post.id} />
          </motion.div>
        ))}
      </Masonry>

      {posts.length === 0 && (
        <div className="text-center text-gray-500 text-xl mt-8">
          No posts found. Be the first to create one!
        </div>
      )}
    </div>
  );
};

export default HomePage;
