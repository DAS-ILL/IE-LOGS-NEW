# Create Django superuser on CentOS server

$SERVER_IP = "192.168.0.223"
$SERVER_USER = "root"
$DEPLOY_DIR = "/opt/ie-logs"

Write-Host "=========================================="
Write-Host "Creating Django Superuser"
Write-Host "=========================================="
Write-Host ""

Write-Host "This will prompt for username, email, and password."
Write-Host ""

ssh -t $SERVER_USER@$SERVER_IP "cd $DEPLOY_DIR && docker compose exec backend python manage.py createsuperuser"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Superuser created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now login at: http://${SERVER_IP}/login"
} else {
    Write-Host ""
    Write-Host "✗ Failed to create superuser." -ForegroundColor Red
}
