<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

try {
    $db = getDB();
    $collection = $db->selectCollection('projects');
    
    // If collection is empty, seed it with some initial projects
    if ($collection->countDocuments() === 0) {
        $collection->insertMany([
            [
                'title' => 'CSEC Club Mentorship',
                'category' => 'Campus Community',
                'description' => 'Mentored junior students on project setup, presentation preparation, and study workflows.',
                'image' => 'assets/images/mentorship.jpg',
                'delay' => 100
            ],
            [
                'title' => 'Campus Volunteer Day',
                'category' => 'Volunteer Work',
                'description' => 'Coordinated with peers to organize student support activities and improve event execution.',
                'image' => 'assets/images/volunteer.jpg',
                'delay' => 200
            ],
            [
                'title' => 'Semester Goal System',
                'category' => 'Planning',
                'description' => 'Created a simple planning workflow for class milestones, revisions, and personal growth goals.',
                'image' => '', // Pattern background handled by frontend
                'pattern' => 'pattern-3',
                'delay' => 300
            ]
        ]);
    }

    $projects = $collection->find()->toArray();
    echo json_encode($projects);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
