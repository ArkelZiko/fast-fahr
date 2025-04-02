<?php

include "../config/connect.php";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(["error" => "Missing user_id"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM posts WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($listings);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
