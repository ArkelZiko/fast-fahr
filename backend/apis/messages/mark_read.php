<?php

/**
 * File:         mark_read.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 4th, 2025
 * Description:  Marks messages from a sender as read for the logged-in user.
 */

include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include '../../config/connect.php';
include '../../models/MessageModel.php';
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

$data = json_decode(file_get_contents('php://input'), true);
$senderId = filter_var($data['sender_id'] ?? null, FILTER_VALIDATE_INT);

if (!$senderId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing or invalid sender_id.']);
    exit;
}

$messageModel = new Message($dbh);
$success = $messageModel->markMessagesAsRead($loggedInUserId, $senderId);

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Messages marked as read operation completed.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to mark messages as read.']);
}

exit;