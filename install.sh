#!/bin/bash

echo "=== Renx-Play Installation Script ==="
echo ""

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 7.4 or higher."
    exit 1
fi

# Check PHP version
PHP_VERSION=$(php -r "echo PHP_VERSION;")
echo "✅ PHP version: $PHP_VERSION"

# Check if MySQL is available
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL client not found. Please make sure MySQL server is running."
fi

# Check if required PHP extensions are installed
REQUIRED_EXTENSIONS=("pdo" "pdo_mysql")
for ext in "${REQUIRED_EXTENSIONS[@]}"; do
    if ! php -m | grep -q "$ext"; then
        echo "❌ PHP extension '$ext' is not installed."
        exit 1
    fi
done

echo "✅ All required PHP extensions are installed."

# Create database configuration
echo ""
echo "=== Database Configuration ==="
read -p "Enter MySQL host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Enter MySQL username (default: root): " DB_USER
DB_USER=${DB_USER:-root}

read -s -p "Enter MySQL password: " DB_PASS
echo ""

read -p "Enter database name (default: renx_play): " DB_NAME
DB_NAME=${DB_NAME:-renx_play}

# Update config file
sed -i "s/define('DB_HOST', 'localhost');/define('DB_HOST', '$DB_HOST');/" api/config.php
sed -i "s/define('DB_NAME', 'renx_play');/define('DB_NAME', '$DB_NAME');/" api/config.php
sed -i "s/define('DB_USER', 'root');/define('DB_USER', '$DB_USER');/" api/config.php
sed -i "s/define('DB_PASS', '');/define('DB_PASS', '$DB_PASS');/" api/config.php

echo "✅ Configuration updated."

# Run setup script
echo ""
echo "=== Running Database Setup ==="
php setup.php

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Installation completed successfully!"
    echo ""
    echo "=== Next Steps ==="
    echo "1. Make sure your web server is configured to serve this directory"
    echo "2. For Apache: Enable mod_rewrite"
    echo "3. For Nginx: Use the provided nginx.conf configuration"
    echo "4. Access the application at: http://localhost"
    echo "5. Admin user created with ID: admin"
    echo ""
    echo "=== Files Created ==="
    echo "• index.html - Main application page"
    echo "• styles.css - Application styles"
    echo "• script.js - Application logic"
    echo "• api/ - Backend PHP files"
    echo "• database.sql - Database schema"
    echo "• setup.php - Database setup script"
    echo "• .htaccess - Apache configuration"
    echo "• nginx.conf - Nginx configuration"
    echo ""
    echo "Happy gaming! 🎮"
else
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi