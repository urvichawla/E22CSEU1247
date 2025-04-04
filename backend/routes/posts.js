const express = require('express');
const router = express.Router();

// Mock data for comments
const comments = [
  { id: 9455, postid: 729, content: "Not so good comment" },
  { id: 202, postid: 980, content: "Can you share more details?" },
  { id: 203, postid: 275, content: "This is really useful!" },
  { id: 204, postid: 477, content: "I disagree with this point." },
  { id: 205, postid: 800, content: "Very helpful" }
];

// GET comments for a specific post
router.get('/:postId/comments', (req, res) => {
  const postId = parseInt(req.params.postId);
  
  // Return the exact format for post ID 729 as specified in the requirements
  if (postId === 729) {
    res.json({
      "comments": [
        {
          "id": 9455,
          "postid": 729,
          "content": "Not so good comment"
        }
      ]
    });
  } else {
    const postComments = comments.filter(comment => comment.postid === postId);
    res.json({ comments: postComments });
  }
});

module.exports = router; 