<?php
require_once __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;
use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

function getDB() {
    $uri = $_ENV['MONGODB_URI'] ?? 'mongodb://localhost:27017';
    $dbName = $_ENV['MONGODB_DB'] ?? 'bio_db';
    
    $client = new Client($uri);
    return $client->selectDatabase($dbName);
}
