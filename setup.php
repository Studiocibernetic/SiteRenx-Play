<?php
require_once 'api/config.php';
require_once 'api/database.php';

echo "Setting up Renx-Play database...\n";

try {
    // Create database connection
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database '" . DB_NAME . "' created or already exists.\n";
    
    // Connect to the specific database
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
    
    // Create database instance and tables
    $db = new Database();
    $db->createTables();
    echo "Database tables created successfully.\n";
    
    // Seed initial data
    $db->seedData();
    echo "Sample data seeded successfully.\n";
    
    echo "\nSetup completed successfully!\n";
    echo "You can now access the application at: http://localhost\n";
    echo "Admin user created with ID: admin\n";
    
} catch (Exception $e) {
    echo "Error during setup: " . $e->getMessage() . "\n";
    exit(1);
}
?>