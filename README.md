# Social Media Analytics

A web application to analyze and display social media data with custom backend endpoints.

## Project Structure

The project consists of two main parts:

- **Backend**: Express.js server that provides the API endpoints
- **Frontend**: React application that consumes the API and displays the data

## Backend Endpoints

1. `GET /users`: Get all users
   - Returns: `{ "users": { "1": "John Doe", "2": "Jane Doe", ... } }`

2. `GET /users/:userId/posts`: Get posts for a specific user
   - For user ID 1, returns a specific set of posts as requested
   - Format: `{ "posts": [ { "id": 729, "userid": 1, "content": "Post about notebook" }, ... ] }`

3. `GET /posts/:postId/comments`: Get comments for a specific post
   - For post ID 729, returns a specific comment as requested
   - Format: `{ "comments": [ { "id": 9455, "postid": 729, "content": "Not so good comment" } ] }`

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install express cors
   ```

3. Start the backend server:
   ```
   node server.js
   ```

The backend server will run on http://localhost:5000

### Frontend Setup

The frontend is already set up in the main directory.

1. Open a new terminal and navigate to the main project directory:
   ```
   cd ..
   ```

2. Install frontend dependencies (if not already installed):
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

The frontend application will run on http://localhost:5173 (or another port if 5173 is occupied)

## Usage

1. After starting both the backend and frontend servers, open your browser and navigate to http://localhost:5173
2. The application shows:
   - Top Users: Users with the most posts
   - Latest Posts: Recent posts from various users
   - Trending Posts: Posts with the most comments

## Troubleshooting

If you're getting errors like "Unexpected token '<', '<!doctype '", make sure:
1. Your backend server is running on port 5000
2. You're starting the backend server first before the frontend
3. No other application is using port 5000

## Note

All data is served from our custom backend endpoints. No external APIs are used.
