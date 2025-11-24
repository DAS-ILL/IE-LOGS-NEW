#!/bin/bash
# Setup script for IE LOGS Django application

echo "=========================================="
echo "IE LOGS Setup - Creating Database Schema"
echo "==========================================

"

# Step 1: Make migrations for accounts app first (custom User model)
echo "[1/5] Creating migrations for accounts app..."
python manage.py makemigrations accounts
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create accounts migrations"
    exit 1
fi

# Step 2: Make migrations for projects app
echo "[2/5] Creating migrations for projects app..."
python manage.py makemigrations projects
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create projects migrations"
    exit 1
fi

# Step 3: Run all migrations
echo "[3/5] Running all migrations..."
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "ERROR: Migrations failed"
    exit 1
fi

# Step 4: Create superuser
echo "[4/5] Creating superuser..."
python manage.py createsuperuser --noinput --username admin --email admin@example.com || echo "Superuser already exists"

# Step 5: Start Gunicorn
echo "[5/5] Starting Gunicorn server..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000
