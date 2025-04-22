<?php

/**
 * File:         add.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 17th, 2025
 * Description:  Creating a bookmark which on the backend is adding a listing
 *               to the db inside the bookmarks table
 *               user has to be logged in for this action
 */

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
  $sql = "INSERT IGNORE INTO bookmarks (user_id, post_id, created_at) VALUES (:user_id, :post_id, NOW())";
  $stmt = $dbh->prepare($sql);
  $stmt->bindParam(':user_id', $loggedInUserId, PDO::PARAM_INT);
  $stmt->bindParam(':post_id', $post_id, PDO::PARAM_INT);
  $stmt->execute();

  if ($stmt->rowCount() > 0) {
      echo json_encode(['success'=>true,'message'=>'Bookmarked']);
  } else {
      echo json_encode(['success'=>true,'message'=>'Bookmark already exists']);
  }

} catch (PDOException $e) {
    error_log("Database Error in bookmarks/add.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Database error occurred while adding bookmark.']);
} catch (Exception $e) {
    error_log("General Error in bookmarks/add.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'An unexpected server error occurred.']);
}
?>