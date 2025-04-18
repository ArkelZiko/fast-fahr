<?php
include "../../config/connect.php";
header('Content-Type: application/json');
session_start();
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
  $sql = "DELETE FROM bookmarks WHERE user_id=? AND post_id=?";
  $stmt = $dbh->prepare($sql);
  $stmt->execute([$_SESSION['user_id'],$post_id]);
  echo json_encode(['success'=>true,'message'=>'Un-bookmarked']);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success'=>false,'message'=>'Server error']);
}
