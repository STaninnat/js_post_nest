# PostNest - Frontend and Backend on Cloud Run

This branch demonstrates an architecture where both the frontend and backend are hosted on Google Cloud Run. The frontend (Vite React) and backend (Node.js & Express) are both deployed as services in Cloud Run.
Features

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

## Architecture

- **Frontend and Backend on Cloud Run**

  - The frontend (built using Vite React) and the backend (built with Node.js & Express) are containerized and deployed on Google Cloud Run.
  - Cloud Run allows both services to scale automatically, and they are managed as serverless containers.

- **API Gateway with Cloud Run**
  - Both services are available through their respective endpoints, with the frontend serving static files and the backend exposing APIs.

## Deployment Process

- **Frontend Deployment (Cloud Run)**

  - The frontend files are built and containerized using Docker, and then deployed to Cloud Run.
  - Cloud Run manages the scaling of the frontend automatically based on incoming traffic.

- **Backend Deployment (Cloud Run)**
  - The backend is also containerized and deployed to Cloud Run, with automatic scaling and API management handled by Cloud Run.
  - Knex migrations are executed when the backend container is initialized.

## Files to Note

- Frontend: Dockerfile in /frontend/Dockerfile for containerizing the frontend.
- Backend: Dockerfile in /backend/Dockerfile for containerizing the backend.
- Cloud Run: The cd.yml GitHub Actions pipeline will manage building and deploying both services to Cloud Run.

## CI/CD Configuration (GitHub Actions)

The GitHub Actions pipeline handles the deployment for both frontend and backend to Google Cloud Run. The pipeline will:

1. Build and deploy the frontend to Cloud Run.
2. Build and deploy the backend to Cloud Run.

## Notes

- Make sure the Google Cloud Project is properly configured with Cloud Run and Cloud SQL enabled.
- Ensure the correct .env configurations are set up for both frontend and backend services.
- The frontend and backend containers will automatically scale based on traffic.
