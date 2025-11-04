#!/bin/bash

# EC2 Deployment Script for Todo App
set -e

echo "Starting deployment to EC2..."

# Update system
sudo apt update -y
sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Node.js (for local development if needed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Create application directory
mkdir -p ~/todo-app
cd ~/todo-app

# Clone repository (replace with your actual repo URL)
# git clone https://github.com/yourusername/todo-list.git .
# For now, we'll assume the files are copied via SCP or other means

# Create environment file
cat > .env << EOF
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://mongo:27017/todoapp
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOF

# Build and start the application
docker-compose down
docker-compose build
docker-compose up -d

echo "Deployment completed successfully!"
echo "Frontend will be available at: http://13.55.52.73"
echo "Backend API will be available at: http://13.55.52.73:5000"
echo ""
echo "To check logs: docker-compose logs -f"
echo "To stop: docker-compose down"