#!/bin/bash

# IE LOGS Deployment Script for CentOS
# This script deploys the application to the CentOS server at 192.168.0.223

echo "=========================================="
echo "IE LOGS Application Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Server details
SERVER_IP="192.168.0.223"
SERVER_USER="root"
DEPLOY_DIR="/opt/ie-logs"

echo -e "${YELLOW}Step 1: Testing SQL Server connection...${NC}"
echo "Connecting to SQL Server at 192.168.1.201..."

echo -e "\n${YELLOW}Step 2: Preparing files for deployment...${NC}"
echo "Creating deployment package..."

# Create a temporary directory for deployment
TEMP_DIR=$(mktemp -d)
echo "Temporary directory: $TEMP_DIR"

# Copy all necessary files
cp -r backend frontend docker-compose.yml .env $TEMP_DIR/
echo "Files copied to temporary directory"

echo -e "\n${YELLOW}Step 3: Connecting to CentOS server...${NC}"
echo "Server: $SERVER_IP"
echo "You will be prompted for the root password..."

# Create deployment directory on server
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
echo "Creating deployment directory..."
mkdir -p /opt/ie-logs
echo "Installing Docker and Docker Compose if not present..."
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    yum install -y yum-utils
    yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl start docker
    systemctl enable docker
fi
echo "Docker installation complete"
ENDSSH

echo -e "\n${YELLOW}Step 4: Copying files to server...${NC}"
scp -r $TEMP_DIR/* $SERVER_USER@$SERVER_IP:$DEPLOY_DIR/

echo -e "\n${YELLOW}Step 5: Building and starting containers on server...${NC}"
ssh $SERVER_USER@$SERVER_IP << ENDSSH
cd $DEPLOY_DIR
echo "Stopping existing containers..."
docker-compose down
echo "Building Docker images..."
docker-compose build
echo "Starting containers..."
docker-compose up -d
echo "Waiting for services to start..."
sleep 10
echo "Running database migrations..."
docker-compose exec -T backend python manage.py migrate
echo "Collecting static files..."
docker-compose exec -T backend python manage.py collectstatic --noinput
echo "Deployment complete!"
ENDSSH

# Cleanup
rm -rf $TEMP_DIR

echo -e "\n${GREEN}=========================================="
echo "Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo "Application is running at: http://192.168.0.223"
echo ""
echo "Next steps:"
echo "1. Create superuser: ssh root@192.168.0.223 'cd /opt/ie-logs && docker-compose exec backend python manage.py createsuperuser'"
echo "2. Access the application at http://192.168.0.223"
echo ""
