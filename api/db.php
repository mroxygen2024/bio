<?php
require_once __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

function getDB() {
    $uri = "mongodb://localhost:27017";
    $client = new Client($uri);
    return $client->selectDatabase('bio_db');
}
