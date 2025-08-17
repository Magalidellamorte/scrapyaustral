#!/bin/bash

# Script to update Laravel dependencies to address security vulnerabilities
# Run this script to update packages to safer versions

echo "🔧 Updating Laravel dependencies to address security vulnerabilities..."

# Update Guzzle to fix multiple CVEs
composer require guzzlehttp/guzzle:^7.4.5

# Update Laravel Framework to fix environment manipulation vulnerability  
composer require laravel/framework:^8.83.28

# Update other packages with known vulnerabilities
composer require nesbot/carbon:^2.72.6
composer require phpseclib/phpseclib:^3.0.36
composer require league/commonmark:^2.7.0
composer require symfony/http-foundation:^5.4.46
composer require symfony/http-kernel:^5.4.20
composer require symfony/process:^5.4.46

# Update Firebase JWT if used directly
composer require firebase/php-jwt:^6.0.0

# Update PSR-7 implementations
composer require guzzlehttp/psr7:^2.4.5
composer require nyholm/psr7:^1.6.1

echo "✅ Dependencies updated! Please test your application thoroughly."
echo "🔍 Run 'composer audit' again to verify security improvements."
echo ""
echo "⚠️  Note: SwiftMailer is deprecated. Consider migrating to Symfony Mailer:"
echo "   composer require symfony/mailer"
echo "   composer remove swiftmailer/swiftmailer"
echo ""
echo "🧪 After updating, run:"
echo "   php artisan config:cache"
echo "   php artisan route:cache"
echo "   php artisan view:cache"
echo "   composer dump-autoload"
