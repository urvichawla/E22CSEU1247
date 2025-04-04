import { useState, useEffect, useCallback } from 'react';
import { getUsers, getUserPosts } from '../services/api';
import UserCard from '../components/UserCard';
import LoadingSpinner from '../components/LoadingSpinner';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Memoize the fetch function to avoid recreation on every render
  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all users
      const usersData = await getUsers();
      
      // Get all users as entries to process
      const userEntries = Object.entries(usersData);
      
      // Create a map to store post counts to avoid duplicate fetching
      const postCountMap = new Map();
      
      // Process users in batches to avoid overwhelming the API
      const BATCH_SIZE = 5;
      const processUserBatch = async (startIndex) => {
        const endIndex = Math.min(startIndex + BATCH_SIZE, userEntries.length);
        const batch = userEntries.slice(startIndex, endIndex);
        
        // Process each user in parallel within the batch
        const batchPromises = batch.map(async ([userId, username]) => {
          try {
            const posts = await getUserPosts(userId);
            return { userId, username, postCount: posts.length };
          } catch (error) {
            console.error(`Error fetching posts for user ${userId}:`, error);
            return { userId, username, postCount: 0 };
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        
        // Add results to the map
        batchResults.forEach(result => {
          postCountMap.set(result.userId, result);
        });
        
        // If there are more users to process, continue with the next batch
        if (endIndex < userEntries.length) {
          await processUserBatch(endIndex);
        }
      };
      
      // Start processing batches
      await processUserBatch(0);
      
      // Convert the map to an array and sort
      const allUsers = Array.from(postCountMap.values());
      
      // Sort users by post count and get top 5
      const sortedUsers = allUsers
        .sort((a, b) => b.postCount - a.postCount)
        .slice(0, 5);
      
      setTopUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching top users:', error);
      setError('Failed to load top users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [refreshTrigger]); // Only recreate when refresh is triggered

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleRefresh = () => {
    // Increment the refresh trigger to re-run the fetch function
    setRefreshTrigger(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Loading top users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-red-500 text-center mb-4">{error}</div>
        <button 
          onClick={handleRefresh}
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
        <h2 className="text-2xl font-bold">Top 5 Users</h2>
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
              <span className="text-black text-lg">Refresh Users</span>
            </>
          )}
        </button>
      </div>
      
      {topUsers.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topUsers.map((user) => (
            <UserCard 
              key={user.userId} 
              user={user.username} 
              postCount={user.postCount} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopUsers;