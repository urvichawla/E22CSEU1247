import { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef(null);
  const postCacheRef = useRef(new Map());

  // Memoized fetch function to avoid re-creating on each render
  const fetchFeed = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    
    try {
      // First get all users from our backend
      const usersResponse = await fetch('http://localhost:5000/users');
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const usersData = await usersResponse.json();
      setUsers(usersData.users);
      
      // Get posts from random users to simulate a dynamic feed
      const allUserIds = Object.keys(usersData.users);
      const randomUserIds = getRandomUsers(allUserIds, 5);
      
      let newPosts = [];
      
      // Process each user sequentially to avoid overwhelming the API
      for (const userId of randomUserIds) {
        try {
          const postsResponse = await fetch(`http://localhost:5000/users/${userId}/posts`);
          if (!postsResponse.ok) {
            throw new Error(`Failed to fetch posts for user ${userId}`);
          }
          const postsData = await postsResponse.json();
          
          // Add user info and timestamp to each post
          const processedPosts = postsData.posts.map(post => {
            return { 
              ...post, 
              userId,
              timestamp: new Date().toISOString()
            };
          });
          
          newPosts = [...newPosts, ...processedPosts];
        } catch (error) {
          console.error(`Error fetching posts for user ${userId}:`, error);
          // Continue with other users even if one fails
        }
      }
      
      // Add new posts to our cache
      newPosts.forEach(post => {
        if (!postCacheRef.current.has(post.id)) {
          postCacheRef.current.set(post.id, post);
        }
      });
      
      // Get all cached posts
      const allCachedPosts = Array.from(postCacheRef.current.values());
      
      // Sort by timestamp, newest first
      const sortedPosts = allCachedPosts.sort((a, b) => {
        const dateA = new Date(a.timestamp || 0);
        const dateB = new Date(b.timestamp || 0);
        return dateB - dateA;
      });
      
      setPosts(sortedPosts);
      setError(null);
    } catch (error) {
      console.error('Error fetching feed:', error);
      setError('Failed to load feed. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Helper to get random users for feed
  const getRandomUsers = (userIds, count) => {
    const shuffled = [...userIds].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleRefresh = () => {
    fetchFeed(false);
  };

  useEffect(() => {
    // Initial load
    fetchFeed(true);
    
    // Set up polling for new posts
    const POLLING_INTERVAL = 30000; // 30 seconds
    intervalRef.current = setInterval(() => fetchFeed(false), POLLING_INTERVAL);
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchFeed]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Loading latest posts...</p>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-red-500 text-center mb-4">{error}</div>
        <button 
          onClick={() => fetchFeed(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Latest Posts</h2>
        <button 
          onClick={handleRefresh}
          className="bg-green-600 hover:bg-green-700 text-black text-lg font-extrabold px-5 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <span className="w-5 h-5 mr-2 rounded-full border-3 border-black border-t-transparent animate-spin"></span>
              <span className="text-black text-lg">Refreshing...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-black text-lg">Refresh Feed</span>
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
          <p className="text-sm mt-1">Showing cached posts. New posts will appear when connection is restored.</p>
        </div>
      )}
      
      {posts.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-gray-600">No posts found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post}
              username={users[post.userId]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;