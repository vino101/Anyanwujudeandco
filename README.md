# Advanced Web App Backend

This backend serves a modern web application with user authentication, database integration, and a responsive frontend. It's designed for deployment with Docker and docker-compose.

## Features

- **User Authentication**: JWT-based login and registration
- **Database Integration**: MongoDB for persistent data storage
- **Security**: Helmet for security headers, rate limiting, input validation
- **API Endpoints**:
  - `/api/health` - Health check
  - `/api/data` - Sample data
  - `/api/register` - User registration
  - `/api/login` - User login
  - `/api/profile` - Protected user profile (requires auth)
  - `/api/contact` - Contact form submission
- **Static Frontend**: Serves the frontend from `../frontend`
- **Containerized Deployment**: Dockerfile and docker-compose setup

## Quick Start (Development)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (copy `.env.example` to `.env` and update values)

3. Start MongoDB (locally or via docker-compose)

4. Run the server:
   ```bash
   npm run start:dev  # For development with nodemon
   # or
   npm start  # For production
   ```

## Production Deployment

Use docker-compose for full stack deployment:

```bash
docker-compose up --build
```

This will start the backend, MongoDB, and serve the frontend.

## Environment Variables

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens

## Notes

- For production, change the JWT secret and configure MongoDB securely.
- The contact form stores messages in MongoDB; integrate with email service if needed.
- Frontend is served statically; for SPA routing, additional configuration may be required.
