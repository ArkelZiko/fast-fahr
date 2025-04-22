<?php
include "../../config/connect.php";
include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['success'=>false,'message'=>'Not authenticated']);
  exit;
}

$post_id = filter_input(INPUT_POST,'post_id',FILTER_VALIDATE_INT);

if (!$post_id) {
  http_response_code(400);
  echo json_encode(['success'=>false,'message'=>'Invalid or missing post_id']);
  exit;
}

$loggedInUserId = $_SESSION['user_id'];

try {
  $sql = "DELETE FROM bookmarks WHERE user_id = :user_id AND post_id = :post_id";
  $stmt = $dbh->prepare($sql);
  $stmt->bindParam(':user_id', $loggedInUserId, PDO::PARAM_INT);
  $stmt->bindParam(':post_id', $post_id, PDO::PARAM_INT);
  $stmt->execute();

  if ($stmt->rowCount() > 0) {
      echo json_encode(['success'=>true,'message'=>'Un-bookmarked']);
  } else {
      echo json_encode(['success'=>true,'message'=>'Bookmark not found or already removed']);
  }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Database error occurred while removing bookmark.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'An unexpected server error occurred.']);
}
?>