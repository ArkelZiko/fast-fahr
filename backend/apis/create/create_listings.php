<?php

include "../config/connect.php";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => "Unauthorized"]);
    exit;
}

$data = json_encode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
    exit;
}

$user_id = $_SESSION['user-id'];
$title     = $data['title'];
$make      = $data['make'];
$model     = $data['model'];
$year      = (int)$data['year'];
$price     = (float)$data['price'];
$mileage   = (int)$data['mileage'];
$image     = $data['image'];
$createdAt = date('Y-m-d H:i:s');

$stmt = $pdo->prepare("INSERT INTO posts (title, make, model, year, price, mileage, image, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$success = $stmt->execute([$title, $make, $model, $year, $price, $mileage, $image, $createdAt]);

if ($success) {
    echo json_encode(['success' => true, 'post_id' => $pdo->lastInsertId()]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create listing']);
}
