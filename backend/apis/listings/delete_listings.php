<?php

/**
 * File:         delete_listings.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 21st, 2025
 * Description:  Handles deletion of a car listing from the db.
 */

include __DIR__ . '/../../config/connect.php';
include __DIR__ . '/../auth/auth_check.php';
include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$loggedInUserId = null;
if (function_exists('require_login')) {
    try { //
      $loggedInUserId = require_login();
    } catch (Exception $e) {
       http_response_code(401);
       echo json_encode(['success' => false, 'error' => 'Not authenticated']);
       exit;
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Authentication system unavailable.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only POST allowed.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$listingIdToDelete = filter_var($data['listing_id'] ?? null, FILTER_VALIDATE_INT);

if (!$listingIdToDelete) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing or invalid listing ID.']);
    exit;
}

$cmd = "DELETE FROM posts WHERE id = ? AND user_id = ?";
$stmt = $dbh->prepare($cmd);
$params = [$listingIdToDelete, $loggedInUserId];
$success = $stmt->execute($params);

if ($success) {
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Listing deleted.']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Listing not found or permission denied.']);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error during deletion.']);
}

exit;