# PostNest

![code coverage badge](https://github.com/STaninnat/js_post_nest/actions/workflows/ci.yml/badge.svg)

This project uses Node.js with Express for the backend and Vite React for the frontend, handling user authentication, posts, and comments.

## Features

- **User Authentication**
  - JWT-based authentication for secure API access.
  - Sign-up, sign-in, and sign-out endpoints.
  - Token refresh mechanism for session management.
  - Middleware to protect authenticated routes.
- **Post and Comment Management**
  - Users can create, edit, and delete their posts.
  - Users can comment on posts.
  - API routes to fetch all posts or user-specific posts.
- **Profile Management**
  - Users can retrieve their profile information.
  - Users can view all posts they have created.
- **Middleware**
  - Custom authentication middleware to protect API routes.
- **Frontend** (Vite React)
  - Authentication pages for user sign-up and login.
  - Home page for creating posts and comments.
  - Profile page to display user details and their posts.

## Installation and Tools Used

- **Backend**
  - Node.js & Express: The core framework for handling API requests.
  - JWT: Used for authentication and token management.
  - Middleware for Authentication: Ensures secure access to protected routes.
  - Database (e.g., MongoDB, PostgreSQL, or MySQL): Stores user data, posts, and comments.
- **Frontend**
  - Vite React: A fast build tool for developing the frontend.
  - React Router: Manages routing between authentication, home, and profile pages.
  - State Management (e.g., Context API, Redux): Manages user state.

## Local Development

Clone the repository

```bash
git clone https://github.com/STaninnat/js_post_nest
cd js_post_nest
```

Set up the backend

```bash
cd backend
npm install
```

Configure environment variables. Copy the .env.example file to .env and fill in the values. You'll need to update values in the .env file to match your configuration.

```bash
cp .env.example .env
```

Start the backend server:

```bash
npm start
```

Set up the frontend

```bash
cd frontend
npm install
```

Start the frontend server:

```bash
npm run dev
```

## API Endpoints (Backend)

| Method | Endpoint                  | Description                  |
| ------ | ------------------------- | ---------------------------- |
| POST   | /v1/user/signup           | Create a new user            |
| POST   | /v1/user/signin           | User login                   |
| POST   | /v1/user/refresh-key      | Refresh authentication token |
| GET    | /v1/user/auth/info        | Get user profile             |
| POST   | /v1/user/auth/signout     | User logout                  |
| GET    | /v1/user/auth/allposts    | Fetch all posts              |
| GET    | /v1/user/auth/userposts   | Fetch user's own posts       |
| POST   | /v1/user/auth/posts       | Create a new post            |
| POST   | /v1/user/auth/editposts   | Edit a post                  |
| DELETE | /v1/user/auth/deleteposts | Delete a post                |
| POST   | /v1/user/auth/comments    | Add a comment to a post      |
| GET    | /v1/user/auth/comments    | Fetch comments for a post    |

## Notes

- Ensure that the correct `.env` configurations are set up before running the project.
- Modify `DATABASE_URL` based on the chosen database solution.
