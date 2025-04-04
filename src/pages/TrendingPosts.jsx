import { useState, useEffect, useCallback } from 'react';
import { getUsers, getUserPosts, getPostComments } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Use a more efficient approach to find trending posts
  const fetchTrendingPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First get all users
      const usersData = await getUsers();
      setUsers(usersData);
      
      // Get posts from more users but limit number per user
      // This increases our chances of finding truly popular posts
      const userIds = Object.keys(usersData).slice(0, 10); // Increased to 10 users
      
      // Store all fetched posts
      let allPosts = [];
      
      // Process users one by one to avoid overwhelming the API
      for (const userId of userIds) {
        try {
          const posts = await getUserPosts(userId);
          // Add user info and take only first 5 posts per user
          const postsWithUser = posts.slice(0, 5).map(post => ({ ...post, userId }));
          allPosts = [...allPosts, ...postsWithUser];
        } catch (error) {
          console.error(`Error fetching posts for user ${userId}:`, error);
          // Continue with other users even if one fails
        }
      }
      
      // If no posts were found, show error
      if (allPosts.length === 0) {
        throw new Error('No posts found. Try again later.');
      }
      
      // Create a map to efficiently track comment counts
      const commentCountMap = new Map();
      let maxCommentCount = 0;
      
      // Process posts in batches to get comments
      const BATCH_SIZE = 5;
      for (let i = 0; i < allPosts.length; i += BATCH_SIZE) {
        const batch = allPosts.slice(i, i + BATCH_SIZE);
        
        // Process each post in the batch in parallel
        const batchPromises = batch.map(async (post) => {
          try {
            const comments = await getPostComments(post.id);
            const commentCount = comments.length;
            
            // Update the maximum comment count
            maxCommentCount = Math.max(maxCommentCount, commentCount);
            
            return { 
              ...post, 
              commentCount, 
              comments
            };
          } catch (error) {
            console.error(`Error fetching comments for post ${post.id}:`, error);
            return { ...post, commentCount: 0, comments: [] };
          }
        });
        
        const postsWithComments = await Promise.all(batchPromises);
        
        // Add each post to our map
        postsWithComments.forEach(post => {
          commentCountMap.set(post.id, post);
        });
      }
      
      // Extract all posts from the map
      const processedPosts = Array.from(commentCountMap.values());
      
      // Filter posts with max comment count
      const trending = processedPosts.filter(post => post.commentCount === maxCommentCount);
      
      // Sort by post ID for consistency if multiple posts have the same comment count
      const sortedTrending = trending.sort((a, b) => b.id - a.id);
      
      // Limit the display to prevent overwhelming the user
      setTrendingPosts(sortedTrending.slice(0, 4));
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      setError(error.message || 'Failed to load trending posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [refreshTrigger]);

  useEffect(() => {
    fetchTrendingPosts();
  }, [fetchTrendingPosts]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Finding trending posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-red-500 text-center mb-4">{error}</div>
        <button 
          onClick={handleRefresh}
          className="bg-green-600 hover:bg-green-700 text-black text-lg font-extrabold px-5 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 mr-2 rounded-full border-3 border-black border-t-transparent animate-spin"></span>
              <span className="text-black text-lg">Refreshing...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-black text-lg">Refresh Trending</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Trending Posts</h2>
        <button 
          onClick={handleRefresh}
          className="bg-green-600 hover:bg-green-700 text-black text-lg font-extrabold px-5 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 mr-2 rounded-full border-3 border-black border-t-transparent animate-spin"></span>
              <span className="text-black text-lg">Refreshing...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-black text-lg">Refresh Trending</span>
            </>
          )}
        </button>
      </div>
      
      {trendingPosts.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-gray-600">No trending posts found</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            {trendingPosts.length > 1 
              ? `Found ${trendingPosts.length} posts with ${trendingPosts[0].commentCount} comments each` 
              : `Most commented post with ${trendingPosts[0].commentCount} comments`}
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {trendingPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post}
                username={users[post.userId]}
                showComments={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TrendingPosts;