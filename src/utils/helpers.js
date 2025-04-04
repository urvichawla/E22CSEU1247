// Get a random image for users
export const getRandomUserImage = () => {
    const imageId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/user${imageId}/200`;
  };
  
  // Get a random image for posts
  export const getRandomPostImage = () => {
    const imageId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/post${imageId}/400/300`;
  };
  
  // Format date for display
  export const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  };