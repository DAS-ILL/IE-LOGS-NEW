# IE LOGS Deployment Script - Direct SCP Method
# Deploy to 192.168.0.223

$SERVER_IP = "192.168.0.223"
$SERVER_USER = "root"
$DEPLOY_DIR = "/opt/ie-logs"
$LOCAL_DIR = "C:\Users\INKUMN\Desktop\VS\ie-logs-new"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "IE LOGS Application Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Test SSH connection
Write-Host "[Step 1/8] Testing SSH connection..." -ForegroundColor Yellow
ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo 'SSH connection successful'"
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: SSH connection verified" -ForegroundColor Green
} else {
    Write-Host "ERROR: Cannot connect to server" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Create deployment directory on server
Write-Host "[Step 2/8] Creating deployment directory..." -ForegroundColor Yellow
ssh $SERVER_USER@$SERVER_IP "mkdir -p $DEPLOY_DIR/backend $DEPLOY_DIR/frontend"
Write-Host "SUCCESS: Directories created" -ForegroundColor Green
Write-Host ""

# Step 3: Transfer backend files
Write-Host "[Step 3/8] Transferring backend files..." -ForegroundColor Yellow
scp -r "$LOCAL_DIR\backend\*" ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/backend/
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Backend files transferred" -ForegroundColor Green
} else {
    Write-Host "ERROR: Backend transfer failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Transfer frontend files
Write-Host "[Step 4/8] Transferring frontend files..." -ForegroundColor Yellow
scp -r "$LOCAL_DIR\frontend\*" ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/frontend/
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Frontend files transferred" -ForegroundColor Green
} else {
    Write-Host "ERROR: Frontend transfer failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Transfer docker-compose and .env
Write-Host "[Step 5/8] Transferring Docker configuration..." -ForegroundColor Yellow
scp "$LOCAL_DIR\docker-compose.yml" ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/
scp "$LOCAL_DIR\.env" ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Docker configuration transferred" -ForegroundColor Green
} else {
    Write-Host "ERROR: Docker config transfer failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: Check if Docker is installed
Write-Host "[Step 6/8] Checking Docker installation..." -ForegroundColor Yellow
$dockerCheck = ssh $SERVER_USER@$SERVER_IP "command -v docker"
if ($LASTEXITCODE -eq 0 -and $dockerCheck) {
    Write-Host "SUCCESS: Docker is already installed" -ForegroundColor Green
    Write-Host "Docker path: $dockerCheck"
} else {
    Write-Host "Docker not found. Installing Docker..." -ForegroundColor Yellow
    ssh $SERVER_USER@$SERVER_IP "yum install -y yum-utils && yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo && yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS: Docker installed" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Docker installation failed" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# Step 7: Start Docker service
Write-Host "[Step 7/8] Starting Docker service..." -ForegroundColor Yellow
ssh $SERVER_USER@$SERVER_IP "systemctl start docker && systemctl enable docker"
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Docker service started" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to start Docker" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 8: Verify deployment
Write-Host "[Step 8/8] Verifying deployment..." -ForegroundColor Yellow
ssh $SERVER_USER@$SERVER_IP "ls -la $DEPLOY_DIR"
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Deployment Phase 1 Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files deployed to: $DEPLOY_DIR"
Write-Host ""
