<?php
require_once __DIR__ . '/../api/db.php';

try {
    $db = getDB();
    $collections = $db->listCollections();
    echo "Connected to MongoDB successfully!\n";
    echo "Using Database: " . ($_ENV['MONGODB_DB'] ?? 'bio_db') . "\n";
    echo "Collections:\n";
    foreach ($collections as $collection) {
        echo "- " . $collection->getName() . "\n";
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
    echo "Make sure MongoDB is running and .env is configured correctly.\n";
}
