# IE LOGS Build and Start Script
$SERVER_IP = "192.168.0.223"
$SERVER_USER = "root"
$DEPLOY_DIR = "/opt/ie-logs"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Building and Starting IE LOGS Application" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build containers
Write-Host "[Step 1/5] Building Docker containers..." -ForegroundColor Yellow
ssh $SERVER_USER@$SERVER_IP "cd $DEPLOY_DIR ; docker compose build"
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Containers built" -ForegroundColor Green
} else {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Start containers
Write-Host "[Step 2/5] Starting containers..." -ForegroundColor Yellow
ssh $SERVER_USER@$SERVER_IP "cd $DEPLOY_DIR ; docker compose up -d"
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Containers started" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to start" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Wait for backend
Write-Host "[Step 3/5] Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15
Write-Host "SUCCESS: Backend ready" -ForegroundColor Green
Write-Host ""

# Step 4: Run migrations
Write-Host "[Step 4/5] Running database migrations..." -ForegroundColor Yellow
ssh $SERVER_USER@$SERVER_IP "cd $DEPLOY_DIR ; docker compose exec -T backend python manage.py migrate"
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Migrations completed" -ForegroundColor Green
} else {
    Write-Host "ERROR: Migrations failed" -ForegroundColor Red
    Write-Host "Checking logs..." -ForegroundColor Yellow
    ssh $SERVER_USER@$SERVER_IP "cd $DEPLOY_DIR ; docker compose logs backend"
    exit 1
}
Write-Host ""

# Step 5: Check status
Write-Host "[Step 5/5] Checking container status..." -ForegroundColor Yellow
ssh $SERVER_USER@$SERVER_IP "cd $DEPLOY_DIR ; docker compose ps"
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Application Started Successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://$SERVER_IP" -ForegroundColor Cyan
Write-Host "Backend API: http://${SERVER_IP}:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Create superuser with .\create-superuser.ps1" -ForegroundColor Yellow
Write-Host ""
