<?php

header('Access-Control-Allow-Origin: *');
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

$loggedInUserId = require_login();

$otherUserId = filter_input(INPUT_GET, 'other_user_id', FILTER_VALIDATE_INT);

if (!$otherUserId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid other_user_id parameter.']);
    exit;
}

try {
    $messageModel = new Message($dbh);
    $messages = $messageModel->getMessagesBetweenUsers($loggedInUserId, $otherUserId);

    $formattedMessages = [];
    foreach ($messages as $msg) {
         $date = new DateTime($msg['sent_at']);
         $formattedMessages[] = [
             'id' => $msg['message_id'],
             'senderId' => $msg['sender_id'],
             'receiverId' => $msg['receiver_id'],
             'senderName' => $msg['senderName'],
             'senderAvatar' => $msg['senderAvatar'] ?? 'https://i.pravatar.cc/150?img=10',
             'text' => $msg['content'],
             'timestamp' => $date->format('H:i A'),
             'isRead' => (bool)$msg['is_read']
         ];
    }

    echo json_encode($formattedMessages);
    $messageModel->markMessagesAsRead($loggedInUserId, $otherUserId);


} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>