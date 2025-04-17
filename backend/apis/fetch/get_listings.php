<?php

include __DIR__ . '/../../config/connect.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    $stmt = $dbh->prepare("
        SELECT 
            posts.*, 
            post_images.image_path
        FROM posts
        LEFT JOIN post_images 
            ON posts.id = post_images.post_id 
            AND post_images.is_main = 1
        ORDER BY posts.created_at DESC;
    ");

    $stmt->execute();
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($listings);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database error: " . $e->getMessage()
    ]);
}
