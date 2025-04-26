<?php

/**
 * File:         get_messages.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 3rd, 2025
 * Description:  Fetches message history and marks messages as read.
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

$otherUserId = filter_input(INPUT_GET, 'other_user_id', FILTER_VALIDATE_INT);

if (!$otherUserId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid other_user_id parameter.']);
    exit;
}

$messageModel = new Message($dbh);

$messages = $messageModel->getMessagesBetweenUsers($loggedInUserId, $otherUserId);

$formattedMessages = [];
foreach ($messages as $msg) {
    try {
        $date = new DateTimeImmutable($msg['sent_at']);
        $timestamp = $date->format('H:i A');
    } catch(Exception $e) {
        $timestamp = 'Invalid Time';
    }
    $formattedMessages[] = [
        'id' => $msg['message_id'],
        'senderId' => $msg['sender_id'],
        'receiverId' => $msg['receiver_id'],
        'senderName' => $msg['senderName'],
        'senderAvatar' => $msg['senderAvatar'] ?? 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        'text' => $msg['content'],
        'timestamp' => $timestamp,
        'isRead' => (bool)$msg['is_read']
    ];
}

$messageModel->markMessagesAsRead($loggedInUserId, $otherUserId);

echo json_encode($formattedMessages);

exit;