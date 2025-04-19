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

$post_id = filter_input(INPUT_POST,'post_id',FILTER_VALIDATE_INT);
if (!$post_id) {
  http_response_code(400);
  exit(json_encode(['success'=>false,'message'=>'Invalid post_id']));
}

try {
  $sql = "INSERT IGNORE INTO bookmarks (user_id,post_id) VALUES (?,?)";
  $stmt = $dbh->prepare($sql);
  $stmt->execute([$_SESSION['user_id'],$post_id]);

  echo json_encode(['success'=>true,'message'=>'Bookmarked']);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success'=>false,'message'=>'Server error']);
}
