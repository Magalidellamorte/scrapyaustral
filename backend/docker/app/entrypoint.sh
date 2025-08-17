#!/bin/sh
set -e

# Install composer dependencies
composer install --no-interaction --prefer-dist

# Fix permissions for Laravel
echo "Fixing permissions on storage and cache directories..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example"
    cp .env.example .env
fi

# Check if APP_KEY is set
if ! grep -q "^APP_KEY=.\+" .env; then
    echo "Generating application key..."
    php artisan key:generate
fi

# Execute the container's main command (CMD)
exec "$@"
