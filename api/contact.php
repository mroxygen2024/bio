<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
    exit;
}

try {
    $db = getDB();
    $collection = $db->selectCollection('contacts');
    
    $document = [
        'fullName' => $data['fullName'] ?? '',
        'email' => $data['email'] ?? '',
        'subject' => $data['subject'] ?? '',
        'message' => $data['message'] ?? '',
        'created_at' => new MongoDB\BSON\UTCDateTime()
    ];

    $result = $collection->insertOne($document);
    
    if ($result->getInsertedCount() === 1) {
        echo json_encode(['success' => true, 'message' => 'Message saved successfully']);
    } else {
        throw new Exception('Failed to save message');
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
