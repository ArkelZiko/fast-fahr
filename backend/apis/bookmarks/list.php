<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include "../../config/connect.php";
header('Content-Type: application/json');
session_start();

// must be logged in
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    exit(json_encode(['success'=>false,'message'=>'Not authenticated']));
}

try {
    // pull out all posts this user has bookmarked
    $sql = "
      SELECT p.*
      FROM posts p
      JOIN bookmarks b ON p.id = b.post_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    ";
    $stmt = $dbh->prepare($sql);
    $stmt->execute([ $_SESSION['user_id'] ]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
      'success' => true,
      'data'    => $rows
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Server error']);
}
