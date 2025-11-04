#!/bin/bash

# EC2 Instance Setup Script
set -e

echo "Setting up EC2 instance for Todo App..."

# Update system packages
sudo apt update -y
sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip

# Install Docker
echo "Installing Docker..."
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (optional, for development)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Create application directory
mkdir -p ~/todo-app

echo "EC2 setup completed!"
echo "Please log out and log back in for Docker group changes to take effect"
echo "Then copy your application files to ~/todo-app and run the deploy script"