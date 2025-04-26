<?php

/**
 * File:         find_user.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 3rd, 2025
 * Description:  Handles requests to find a user by username, excluding self.
 */

include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include '../../config/connect.php';
include '../../models/UserModel.php';
include '../auth/auth_check.php';

$loggedInUserId = null;
if (function_exists('require_login')) {
   try { $loggedInUserId = require_login(); }
   catch (Exception $e) {
      http_response_code(401); echo json_encode(['success' => false, 'error' => 'Not authenticated']); exit;
   }
} else {
   http_response_code(500); echo json_encode(['success' => false, 'error' => 'Auth system error.']); exit;
}

$usernameToFind = trim(filter_input(INPUT_GET, 'username', FILTER_SANITIZE_SPECIAL_CHARS) ?: '');

if (empty($usernameToFind)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing username parameter.']);
    exit;
}

$userModel = new User($dbh);
$foundUser = $userModel->getUserByUsername($usernameToFind);

if ($foundUser) {
    if ((int)$foundUser['user_id'] === $loggedInUserId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Cannot start conversation with yourself.']);
    } else {
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $foundUser['user_id'],
                'username' => $foundUser['username'],
                'avatar' => $foundUser['profile_picture'] ?? 'https://i.pravatar.cc/150?u=a042581f4e29026704d' // Default avatar if null
            ]
        ]);
    }
} else {
    http_response_code(404); // Not Found
    echo json_encode(['success' => false, 'message' => 'User not found.']);
}

exit;