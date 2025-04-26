<?php

/**
 * File:         update_password.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 25th, 2025
 * Description:  Updates a user's password after verifying the current one.
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

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

$loggedInUserId = null;
if (function_exists('require_login')) {
   try { $loggedInUserId = require_login(); }
   catch (Exception $e) {
      http_response_code(401); echo json_encode(['success' => false, 'error' => 'Not authenticated']); exit;
   }
} else {
   http_response_code(500); echo json_encode(['success' => false, 'error' => 'Auth system error.']); exit;
}

// Read and parse JSON data sent in the request body
$data = json_decode(file_get_contents('php://input'), true);

// Checking if both required password fields are in the request
if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Current password and new password are required.']);
    exit;
}

// Setting variables based on the users input.
$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];

// Checking if the length of the password is valid.
if (strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'New password must be at least 8 characters long.']);
    exit;
}

$cmd_fetch = "SELECT password_hash FROM users WHERE user_id = ?";
$stmt_fetch = $dbh->prepare($cmd_fetch);
$params_fetch = [$loggedInUserId];
$stmt_fetch->execute($params_fetch);
$row = $stmt_fetch->fetch(PDO::FETCH_ASSOC);

if ($row) {
    $currentPasswordHash = $row['password_hash'];

    if (!password_verify($currentPassword, $currentPasswordHash)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Current password is incorrect.']);
        exit;
    }

    $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

    $cmd_update = "UPDATE users SET password_hash = ? WHERE user_id = ?";
    $stmt_update = $dbh->prepare($cmd_update);
    $params_update = [$newPasswordHash, $loggedInUserId];
    $success = $stmt_update->execute($params_update);

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Password updated successfully!']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update password.']);
    }
}

exit;