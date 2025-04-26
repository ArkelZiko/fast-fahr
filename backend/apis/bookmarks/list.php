<?php

/**
 * File:         list.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 17th, 2025
 * Description:  Retrieves all listings bookmarked by the logged-in user.
 */

include "../../config/connect.php";
include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$loggedInUserId = $_SESSION['user_id'];

$cmd = "
  SELECT
      p.*,                   -- Select all columns from posts
      u.username AS creator_username, -- Get the username from the users table
      pi.image_path        -- Select the main image path
  FROM posts p
  JOIN users u ON p.user_id = u.user_id
  JOIN bookmarks b ON p.id = b.post_id
  LEFT JOIN post_images pi ON p.id = pi.post_id AND pi.is_main = 1
  WHERE b.user_id = ?        -- Filter by logged-in user ID
  ORDER BY b.created_at DESC
";

$stmt = $dbh->prepare($cmd);
$params = [$loggedInUserId];
$stmt->execute($params);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'data'    => $rows
]);

exit;