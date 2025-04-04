import { useState, useEffect, useCallback } from 'react';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchTrendingPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const usersResponse = await fetch('http://localhost:5000/users');
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const usersData = await usersResponse.json();
      setUsers(usersData.users);
      
      const userIds = Object.keys(usersData.users).slice(0, 10);
      
      let allPosts = [];
      
      for (const userId of userIds) {
        try {
          const postsResponse = await fetch(`http://localhost:5000/users/${userId}/posts`);
          if (!postsResponse.ok) {
            throw new Error(`Failed to fetch posts for user ${userId}`);
          }
          const postsData = await postsResponse.json();
          
          const postsWithUser = postsData.posts.slice(0, 5).map(post => ({ ...post, userId }));
          allPosts = [...allPosts, ...postsWithUser];
        } catch (error) {
          console.error(`Error fetching posts for user ${userId}:`, error);
        }
      }
      
      if (allPosts.length === 0) {
        throw new Error('No posts found. Try again later.');
      }
      
      const commentCountMap = new Map();
      let maxCommentCount = 0;
      
      const BATCH_SIZE = 5;
      for (let i = 0; i < allPosts.length; i += BATCH_SIZE) {
        const batch = allPosts.slice(i, i + BATCH_SIZE);
        
        const batchPromises = batch.map(async (post) => {
          try {
            const commentsResponse = await fetch(`http://localhost:5000/posts/${post.id}/comments`);
            if (!commentsResponse.ok) {
              throw new Error(`Failed to fetch comments for post ${post.id}`);
            }
            const commentsData = await commentsResponse.json();
            const commentCount = commentsData.comments.length;
            
            maxCommentCount = Math.max(maxCommentCount, commentCount);
            
            return { 
              ...post, 
              commentCount, 
              comments: commentsData.comments
            };
          } catch (error) {
            console.error(`Error fetching comments for post ${post.id}:`, error);
            return { ...post, commentCount: 0, comments: [] };
          }
        });
        
        const postsWithComments = await Promise.all(batchPromises);
        
        postsWithComments.forEach(post => {
          commentCountMap.set(post.id, post);
        });
      }
      
      const processedPosts = Array.from(commentCountMap.values());
      
      const trending = processedPosts.filter(post => post.commentCount === maxCommentCount);
      
      const sortedTrending = trending.sort((a, b) => b.id - a.id);
      
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