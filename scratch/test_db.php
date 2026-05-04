<?php
require_once __DIR__ . '/../api/db.php';

try {
    $db = getDB();
    $collections = $db->listCollections();
    echo "Connected to MongoDB successfully!\n";
    echo "Collections in bio_db:\n";
    foreach ($collections as $collection) {
        echo "- " . $collection->getName() . "\n";
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
    echo "Make sure MongoDB is running (e.g., docker-compose up -d)\n";
}
