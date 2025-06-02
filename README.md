# Cebim100

A full-stack web application with frontend and backend components.

## Project Structure

- `frontend/` - Frontend application
- `backend/` - Backend server
- `docker-compose.yml` - Docker configuration for the entire stack

## Getting Started

### Prerequisites

- Node.js
- Docker and Docker Compose
- MongoDB
- Redis

### Installation

1. Clone the repository:
```bash
git clone https://github.com/akkozkaan/cebim100.git
cd cebim100
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
- Create `.env` files in both frontend and backend directories
- Configure necessary environment variables

4. Start the application:
```bash
# Using Docker
docker-compose up

# Or start services individually
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

## Deployment

### Deploying to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy Frontend:
```bash
cd frontend
vercel
```

3. Deploy Backend:
```bash
cd backend
vercel
```

4. Set up environment variables in Vercel dashboard for both frontend and backend projects.

5. Configure the following environment variables in Vercel:
   - `MONGODB_URI`
   - `REDIS_URL`
   - `RABBITMQ_URL`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `EMAIL_SERVICE`
   - `EMAIL_USER`
   - `EMAIL_PASS`

6. After deployment, update the frontend's API configuration to point to the deployed backend URL.

## Features

- User authentication
- Real-time updates using Socket.IO
- Message queue system using RabbitMQ
- Caching with Redis
- Scheduled tasks
- Email notifications

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Redis
- RabbitMQ
- Socket.IO
- Passport.js for authentication
- Nodemailer for email notifications

### Frontend
- React.js
- Material-UI
- Socket.IO client

## License

MIT 