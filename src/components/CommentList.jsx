import LoadingSpinner from './LoadingSpinner';

const CommentList = ({ comments, isLoading }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (comments.length === 0) {
    return <p className="text-gray-500 text-sm">No comments yet</p>;
  }

  return (
    <div className="mt-2 space-y-2">
      {comments.map(comment => (
        <div key={comment.id} className="bg-gray-100 p-2 rounded-md">
          <p className="text-sm">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList; 