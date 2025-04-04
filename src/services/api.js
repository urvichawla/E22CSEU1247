const BASE_URL = 'http://20.244.56.144/evaluation-service';

// Authentication token
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNzQ3OTk0LCJpYXQiOjE3NDM3NDc2OTQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjA3ZjFkNTJlLWFjZDEtNDgxMy1iNmU1LWMwZWYyODg5YzkwZiIsInN1YiI6ImUyMmNzZXUxMjQ3QGJlbm5ldHQuZWR1LmluIn0sImVtYWlsIjoiZTIyY3NldTEyNDdAYmVubmV0dC5lZHUuaW4iLCJuYW1lIjoidXJ2aSBjaGF3bGEiLCJyb2xsTm8iOiJlMjJjc2V1MTI0NyIsImFjY2Vzc0NvZGUiOiJydENIWkoiLCJjbGllbnRJRCI6IjA3ZjFkNTJlLWFjZDEtNDgxMy1iNmU1LWMwZWYyODg5YzkwZiIsImNsaWVudFNlY3JldCI6IlVDWkRndHZaSFBQTmFram0ifQ.aKWJAxKeoZ6dVMQH2mi9FpsGqL7O_2BJMaVu7vAAKGA";

// Default headers with authentication
const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
  };
};

// Sample data for fallback if API fails
const MOCK_USERS = {
  "1": "John Doe",
  "2": "Jane Doe",
  "3": "Alice Smith", 
  "4": "Bob Johnson",
  "5": "Charlie Brown",
  "6": "Diana White",
  "7": "Edward Davis",
  "8": "Fiona Miller",
  "9": "George Wilson",
  "10": "Helen Moore",
  "11": "Ivy Taylor",
  "12": "Jack Anderson",
  "13": "Kathy Thomas",
  "14": "Liam Jackson",
  "15": "Mona Harris",
  "16": "Nathan Clark",
  "17": "Olivia Lewis",
  "18": "Paul Walker",
  "19": "Quinn Scott",
  "20": "Rachel Young"
};

const MOCK_POSTS = [
  { id: 729, userid: 1, content: "Post about notebook", timestamp: new Date().toISOString() },
  { id: 980, userid: 1, content: "Post about jacket", timestamp: new Date(Date.now() - 100000).toISOString() },
  { id: 275, userid: 1, content: "Post about umbrella", timestamp: new Date(Date.now() - 200000).toISOString() },
  { id: 477, userid: 1, content: "Post about umbrella", timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: 800, userid: 1, content: "Post about grape", timestamp: new Date(Date.now() - 400000).toISOString() },
  { id: 106, userid: 2, content: "Working on a new project. Excited to share it soon!", timestamp: new Date(Date.now() - 500000).toISOString() },
  { id: 107, userid: 3, content: "The sunset today was absolutely breathtaking!", timestamp: new Date(Date.now() - 600000).toISOString() },
  { id: 108, userid: 4, content: "Just adopted a new puppy! Meet Max!", timestamp: new Date(Date.now() - 700000).toISOString() },
  { id: 109, userid: 5, content: "Starting my fitness journey today. Wish me luck!", timestamp: new Date(Date.now() - 800000).toISOString() },
  { id: 110, userid: 6, content: "Anyone else excited for the upcoming tech conference?", timestamp: new Date(Date.now() - 900000).toISOString() }
];

const MOCK_COMMENTS = [
  { id: 9455, postid: 729, content: "Not so good comment" },
  { id: 202, postid: 980, content: "Can you share more details?" },
  { id: 203, postid: 275, content: "This is really useful!" },
  { id: 204, postid: 477, content: "I disagree with this point." },
  { id: 205, postid: 800, content: "Very informative post!" }
];

// Cache for API responses to minimize API calls
const cache = {
  users: null,
  posts: {},
  comments: {},
  lastFetched: {
    users: 0,
    posts: {},
    comments: {}
  }
};

// Cache validity duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Get all users
export const getUsers = async () => {
  try {
    // Check if we have a valid cache
    const now = Date.now();
    if (cache.users && (now - cache.lastFetched.users < CACHE_DURATION)) {
      console.log('Using cached users data');
      return cache.users;
    }

    console.log('Fetching users from API');
    const response = await fetch(`${BASE_URL}/users`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    
    // Update cache
    cache.users = data.users;
    cache.lastFetched.users = now;
    
    return data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    console.warn('Using fallback data for users');
    return MOCK_USERS;
  }
};

// Get posts for a specific user
export const getUserPosts = async (userId) => {
  try {
    // Check if we have a valid cache
    const now = Date.now();
    if (cache.posts[userId] && (now - (cache.lastFetched.posts[userId] || 0) < CACHE_DURATION)) {
      console.log(`Using cached posts data for user ${userId}`);
      return cache.posts[userId];
    }

    console.log(`Fetching posts for user ${userId} from API`);
    const response = await fetch(`${BASE_URL}/users/${userId}/posts`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch posts for user ${userId}`);
    }
    const data = await response.json();
    
    // Add timestamps if they don't exist
    const postsWithTimestamp = data.posts.map(post => ({
      ...post,
      timestamp: post.timestamp || new Date().toISOString()
    }));
    
    // Update cache
    cache.posts[userId] = postsWithTimestamp;
    cache.lastFetched.posts[userId] = now;
    
    return postsWithTimestamp;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    console.warn(`Using fallback data for posts of user ${userId}`);
    return MOCK_POSTS.filter(post => post.userid.toString() === userId.toString());
  }
};

// Get comments for a specific post
export const getPostComments = async (postId) => {
  try {
    // Check if we have a valid cache
    const now = Date.now();
    if (cache.comments[postId] && (now - (cache.lastFetched.comments[postId] || 0) < CACHE_DURATION)) {
      console.log(`Using cached comments data for post ${postId}`);
      return cache.comments[postId];
    }

    console.log(`Fetching comments for post ${postId} from API`);
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch comments for post ${postId}`);
    }
    const data = await response.json();
    
    // Update cache
    cache.comments[postId] = data.comments;
    cache.lastFetched.comments[postId] = now;
    
    return data.comments;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    console.warn(`Using fallback data for comments of post ${postId}`);
    return MOCK_COMMENTS.filter(comment => comment.postid.toString() === postId.toString());
  }
};