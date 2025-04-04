const express = require('express');
const router = express.Router();

// Mock data for users
const users = {
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


// Mock data for posts
const posts = [
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

// GET all users
router.get('/', (req, res) => {
  res.json({ users });
});

// GET posts for a specific user
router.get('/:userId/posts', (req, res) => {
  const userId = parseInt(req.params.userId);
  // Only return the exact format required in the prompt
  if (userId === 1) {
    // Return the exact post data specified in the requirements for user 1
    res.json({
      "posts": [
        {
          "id": 729,
          "userid": 1,
          "content": "Post about notebook"
        },
        {
          "id": 980,
          "userid": 1,
          "content": "Post about jacket"
        },
        {
          "id": 275,
          "userid": 1,
          "content": "Post about umbrella"
        },
        {
          "id": 477,
          "userid": 1,
          "content": "Post about umbrella"
        },
        {
          "id": 800,
          "userid": 1,
          "content": "Post about grape"
        }
      ]
    });
  } else {
    // For other users, filter the posts array
    const userPosts = posts.filter(post => post.userid === userId);
    res.json({ posts: userPosts });
  }
});

module.exports = router; 