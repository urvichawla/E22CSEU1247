import { getRandomUserImage } from '../utils/helpers';

const UserCard = ({ user, postCount }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
      <img 
        src={getRandomUserImage()} 
        alt={user} 
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h3 className="font-semibold text-lg">{user}</h3>
        <p className="text-gray-600">{postCount} posts</p>
      </div>
    </div>
  );
};

export default UserCard;