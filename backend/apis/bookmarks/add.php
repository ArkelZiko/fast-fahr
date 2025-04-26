<?php

/**
 * File:         add.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 17th, 2025
 * Description:  Adds a bookmark for a logged-in user.
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
  echo json_encode(['success' => false, 'message' => 'Not authenticated']);
  exit;
}

$post_id = filter_input(INPUT_POST, 'post_id', FILTER_VALIDATE_INT);
if (!$post_id) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Invalid or missing post_id']);
  exit;
}

$loggedInUserId = $_SESSION['user_id'];

// INSERT IGNORE prevents errors if the bookmark already exists (PK violation)
$cmd = "INSERT IGNORE INTO bookmarks (user_id, post_id, created_at) VALUES (?, ?, NOW())";
$stmt = $dbh->prepare($cmd);
$params = [$loggedInUserId, $post_id];
$success = $stmt->execute($params);

if ($success) {
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Bookmarked']);
    } else {
        echo json_encode(['success' => true, 'message' => 'Bookmark already exists or insertion ignored']);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to add bookmark.']);
}

exit; 