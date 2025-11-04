# Todo List Application

A full-stack todo application built with React, Node.js, Express, and MongoDB. The application features user authentication, task management, and is containerized with Docker for easy deployment.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Completion**: Mark tasks as completed/incomplete
- **Responsive Design**: Works on desktop and mobile devices
- **Docker Support**: Containerized for easy deployment
- **Production Ready**: Optimized for production deployment on AWS EC2

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router DOM for navigation
- Axios for API calls
- CSS3 for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

### Infrastructure
- Docker and Docker Compose
- MongoDB database
- Nginx for frontend serving

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Docker and Docker Compose (for containerized deployment)

## Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/todo-list.git
cd todo-list
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env file with your configuration
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Variables

Create a `.env` file in the backend directory with:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Tasks (Protected Routes)
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Docker Deployment

### Local Docker Development
```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment on AWS EC2

1. **Launch an EC2 instance** (Ubuntu 20.04 or later)

2. **Connect to your EC2 instance**:
```bash
ssh -i your-key.pem ubuntu@13.55.52.73
```

3. **Run the setup script**:
```bash
# Copy the setup script to your EC2 instance
scp -i your-key.pem deployment/ec2-setup.sh ubuntu@13.55.52.73:~/

# SSH into your instance and run setup
ssh -i your-key.pem ubuntu@13.55.52.73
chmod +x ~/ec2-setup.sh
~/ec2-setup.sh

# Logout and login again for Docker group changes
exit
ssh -i your-key.pem ubuntu@13.55.52.73
```

4. **Deploy the application**:
```bash
# Copy your application files to EC2
scp -i your-key.pem -r * ubuntu@13.55.52.73:~/todo-app/

# SSH and deploy
ssh -i your-key.pem ubuntu@13.55.52.73
cd ~/todo-app
chmod +x deployment/deploy.sh
deployment/deploy.sh
```

5. **Access your application**:
   - Frontend: `http://13.55.52.73`
   - Backend API: `http://13.55.52.73:5000`

## Project Structure

```
todo-list/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── userModel.js
│   │   └── taskModel.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── .gitignore
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── TodoList.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── deployment/
│   ├── deploy.sh
│   └── ec2-setup.sh
├── docker-compose.yml
└── README.md
```

## Security Considerations

- JWT tokens are used for authentication
- Passwords are hashed using bcryptjs
- CORS is configured for security
- Environment variables are used for sensitive data
- Docker containers run with minimal privileges

## Performance Optimization

- Frontend is served by Nginx for optimal performance
- MongoDB indexes on frequently queried fields
- Docker images use multi-stage builds for smaller size
- Production builds are optimized and minified

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**:
   - Ensure your MongoDB URI is correct
   - Check if MongoDB is running (local) or accessible (Atlas)
   - Verify network access for MongoDB Atlas

2. **Docker Issues**:
   - Ensure Docker daemon is running
   - Check if ports 80 and 5000 are available
   - Verify Docker Compose version compatibility

3. **EC2 Deployment Issues**:
   - Ensure security groups allow traffic on ports 80 and 5000
   - Check EC2 instance has internet access for package downloads
   - Verify Docker and Docker Compose are properly installed

### Logs and Debugging

```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# MongoDB logs
docker-compose logs mongo

# Check running containers
docker ps

# Check container logs
docker logs <container-id>
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@todoapp.com or open an issue in the GitHub repository.