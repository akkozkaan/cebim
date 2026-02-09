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
   
   **Required:**
   - `MONGODB_URI` - Your MongoDB connection string (Atlas recommended)
   - `JWT_SECRET` - Secret key for JWT tokens
   - `GOOGLE_CLIENT_ID` - Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
   - `NODE_ENV` - Set to `production`
   
   **Optional (can be omitted if not needed):**
   - `REDIS_URL` - Redis connection string (for caching)
   - `RABBITMQ_URL` - RabbitMQ connection string (for message queuing)
   - `EMAIL_SERVICE` - Email service provider
   - `EMAIL_USER` - Email account username
   - `EMAIL_PASS` - Email account password

   **Note:** The application will work without Redis and RabbitMQ. These services are optional and the app will continue to function if they're not configured.

6. After deployment, update the frontend's API configuration to point to the deployed backend URL.

## Troubleshooting

### MongoDB Connection Timeout
If you see errors like `MongooseError: Operation users.findOne() buffering timed out`:
- Ensure your MongoDB connection string is correct
- Whitelist Vercel's IP addresses in MongoDB Atlas (use `0.0.0.0/0` for all IPs)
- Check MongoDB Atlas cluster is running
- Verify the connection string format: `mongodb+srv://username:password@cluster.mongodb.net/database`

### RabbitMQ/Redis Connection Errors
If you see RabbitMQ or Redis connection errors:
- These services are optional - you can remove the environment variables
- The application will continue to work without these services
- Only configure them if you need message queuing (RabbitMQ) or caching (Redis)

### Google OAuth Not Working
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
- Ensure the callback URL is authorized in Google Cloud Console
- Check that the callback URL matches your deployed backend URL

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