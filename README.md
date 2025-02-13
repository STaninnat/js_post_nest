# PostNest - 2 Cloud Provider Deployment (Frontend on AWS S3, Backend on GKE)

This branch demonstrates an architecture where the frontend is hosted on AWS S3 and the backend is hosted on Google Kubernetes Engine (GKE).

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

- **Frontend: AWS S3**

  - The frontend application (Vite React) is built and uploaded to an AWS S3 bucket for hosting. This ensures that the frontend is globally accessible with fast delivery via S3.
  - CI/CD: The frontend is built and uploaded to S3 automatically using GitHub Actions.

- **Backend: Google Kubernetes Engine (GKE)**
  - The backend is deployed on Google Kubernetes Engine (GKE), leveraging Kubernetes for container orchestration.
  - CI/CD: The backend is built using Google Cloud Build and deployed with kubectl commands to GKE, with Ingress and LoadBalancer for routing and managing traffic.

## Key Changes in This Branch

1. Frontend (AWS S3 Hosting)

   - The frontend is built using npm run build and then synced with an AWS S3 bucket using the AWS CLI.

2. Backend (GKE Hosting)
   - The backend is containerized and deployed using Kubernetes on GKE.
   - Deployment is managed via kubectl with configuration files for deployment, service, ingress, and managed certificates.

## Deployment Process

- **Frontend Deployment (AWS S3)**

  - The frontend files are built and uploaded to AWS S3.
  - A GitHub Action pipeline automatically handles building and syncing the /dist directory with the S3 bucket.

- **Backend Deployment (Google Kubernetes Engine)**
  - The backend is built using Google Cloud Build and deployed using kubectl to GKE.
  - GKE clusters are configured to use Ingress with a LoadBalancer for traffic routing.
  - Managed certificates are applied for secure communication.

## Files to Note

- Frontend: /frontend/dist (built files uploaded to AWS S3).
- Backend: Kubernetes manifests in /k8s (includes deployment.yaml, service.yaml, ingress.yaml, managed-cert.yaml).

## CI/CD Configuration (GitHub Actions)

The GitHub Actions pipeline handles the deployment for both frontend and backend. The pipeline will:

1. Build and deploy the frontend to AWS S3.
2. Build and deploy the backend to GKE.

```bash
# Example: Frontend Deployment to AWS S3
- name: Build Frontend and Upload to S3
  run: |
  cd frontend
  npm install
  npm run build
  aws s3 sync ./dist s3://<YOUR_S3_BUCKET_NAME> --delete

# Example: Backend Deployment to GKE
- name: Deploy Backend to GKE
  run: |
  kubectl apply -f k8s/backend-deployment.yaml
  kubectl apply -f k8s/backend-service.yaml
  kubectl apply -f k8s/backend-ingress.yaml
  kubectl apply -f k8s/managed-cert.yaml
```

## Notes

- Ensure the correct .env configurations are set up for the backend deployment.
- The frontend is hosted on AWS S3, so make sure the S3 Bucket is configured properly for static file serving.
- The backend is deployed on GKE and should have the correct Kubernetes configurations in the /k8s directory.
