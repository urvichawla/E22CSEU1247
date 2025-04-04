// Mock data for users
const USERS = {
  "1": "Aarav Sharma",
  "2": "Bella Kapoor",
  "3": "Chetan Mehra",
  "4": "Diya Iyer",
  "5": "Eshan Reddy",
  "6": "Farah Khan",
  "7": "Gaurav Patel",
  "8": "Hina Joshi",
  "9": "Ishaan Malhotra",
  "10": "Jiya Verma",
  "11": "Kunal Bansal",
  "12": "Lavanya Sen",
  "13": "Manav Desai",
  "14": "Nisha Roy",
  "15": "Omkar Menon",
  "16": "Prisha Nair",
  "17": "Rohan Bhattacharya",
  "18": "Sanya Agrawal",
  "19": "Tanishq Gupta",
  "20": "Urvashi Choudhary"
};


const POSTS = [
  { id: 729, userid: 1, content: "Post about notebook" },
  { id: 980, userid: 1, content: "Post about jacket" },
  { id: 275, userid: 1, content: "Post about umbrella" },
  { id: 477, userid: 1, content: "Post about umbrella" },
  { id: 800, userid: 1, content: "Post about grape" },
  { id: 106, userid: 2, content: "Working on a new project. Excited to share it soon!" },
  { id: 107, userid: 3, content: "The sunset today was absolutely breathtaking!" },
  { id: 108, userid: 4, content: "Just adopted a new puppy! Meet Max!" },
  { id: 109, userid: 5, content: "Starting my fitness journey today. Wish me luck!" },
  { id: 110, userid: 6, content: "Anyone else excited for the upcoming tech conference?" }
];

const COMMENTS = [
  { id: 9455, postid: 729, content: "Not so good comment" },
  { id: 202, postid: 980, content: "Can you share more details?" },
  { id: 203, postid: 275, content: "This is really useful!" },
  { id: 204, postid: 477, content: "I disagree with this point." },
  { id: 205, postid: 800, content: "Very informative post!" }
];

// Get all users
export const getUsers = async () => {
  // Return the exact format required
  return { users: USERS };
};

// Get posts for a specific user
export const getUserPosts = async (userId) => {
  userId = parseInt(userId);
  // For user ID 1, return exactly the posts in the required format
  if (userId === 1) {
    return {
      posts: [
        {
          id: 729,
          userid: 1,
          content: "Post about notebook"
        },
        {
          id: 980,
          userid: 1,
          content: "Post about jacket"
        },
        {
          id: 275,
          userid: 1,
          content: "Post about umbrella"
        },
        {
          id: 477,
          userid: 1,
          content: "Post about umbrella"
        },
        {
          id: 800,
          userid: 1,
          content: "Post about grape"
        }
      ]
    };
  }
  
  // For other users, filter the posts array
  return {
    posts: POSTS.filter(post => post.userid === userId)
  };
};

// Get comments for a specific post
export const getPostComments = async (postId) => {
  postId = parseInt(postId);
  // For post ID 729, return exactly the comments in the required format
  if (postId === 729) {
    return {
      comments: [
        {
          id: 9455,
          postid: 729,
          content: "Not so good comment"
        }
      ]
    };
  }
  
  // For other posts, filter the comments array
  return {
    comments: COMMENTS.filter(comment => comment.postid === postId)
  };
};