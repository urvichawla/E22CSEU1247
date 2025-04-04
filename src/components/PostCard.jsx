import { useState, useEffect } from 'react';
import { getRandomPostImage } from '../utils/helpers';
import CommentList from './CommentList';

const PostCard = ({ post, username, showComments = false }) => {
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [post.id, showComments]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/posts/${post.id}/comments`);
      if (!response.ok) {
        throw new Error(`Failed to fetch comments for post ${post.id}`);
      }
      const data = await response.json();
      setComments(data.comments);
      setCommentCount(data.comments.length);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <img 
        src={getRandomPostImage()} 
        alt="Post" 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center mb-2">
          <img 
            src={getRandomPostImage()} 
            alt={username} 
            className="w-10 h-10 rounded-full mr-2"
          />
          <h3 className="font-semibold">{username}</h3>
        </div>
        <p className="text-gray-800 mb-2">{post.content}</p>
        
        {!showComments && (
          <div className="text-sm text-gray-500">
            {commentCount > 0 ? `${commentCount} comments` : 'Loading comments...'}
          </div>
        )}
        
        {showComments && (
          <>
            <button 
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-blue-500 text-sm mb-2"
            >
              {showAllComments ? 'Hide comments' : `Show ${comments.length} comments`}
            </button>
            
            {showAllComments && (
              <CommentList comments={comments} isLoading={isLoading} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;