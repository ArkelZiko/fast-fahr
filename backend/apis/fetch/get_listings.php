<?php

include $_SERVER['DOCUMENT_ROOT'] . '/fastfahr/backend/config/connect.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    $stmt = $dbh->prepare("SELECT * FROM posts ORDER BY created_at DESC");
    $stmt->execute();
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($listings);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database error: " . $e->getMessage()
    ]);
}
