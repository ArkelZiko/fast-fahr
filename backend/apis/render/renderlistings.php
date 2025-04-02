<?php

include "../config/connect.php";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

try {
    // Prepare and execute SQL query
    $stmt = $pdo->prepare("SELECT * FROM posts ORDER BY created_at DESC");
    $stmt->execute();
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($listings); // Return listings as JSON
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
