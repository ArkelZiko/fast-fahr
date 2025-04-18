<?php

header('Access-Control-Allow-Origin: *');
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

$loggedInUserId = require_login();

$data = json_decode(file_get_contents('php://input'), true);

$receiverId = filter_var($data['receiver_id'] ?? null, FILTER_VALIDATE_INT);
$content = trim($data['content'] ?? '');

if (!$receiverId || empty($content)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing receiver_id or content.']);
    exit;
}

 if ($receiverId === $loggedInUserId) {
    http_response_code(400);
    echo json_encode(['error' => 'Cannot send messages to yourself.']);
    exit;
}

try {
    $messageModel = new Message($dbh);
    $newMessageId = $messageModel->sendMessage($loggedInUserId, $receiverId, $content);

    if ($newMessageId) {
        $newMessageData = $messageModel->getMessageById($newMessageId);
        if ($newMessageData) {
             $date = new DateTime($newMessageData['sent_at']);
             $formattedMessage = [
                 'id' => $newMessageData['message_id'],
                 'senderId' => $newMessageData['sender_id'],
                 'receiverId' => $newMessageData['receiver_id'],
                 'senderName' => $newMessageData['senderName'],
                 'senderAvatar' => $newMessageData['senderAvatar'] ?? 'https://i.pravatar.cc/150?img=10',
                 'text' => $newMessageData['content'],
                 'timestamp' => $date->format('H:i A'),
                 'isRead' => false
             ];
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Message sent.', 'newMessage' => $formattedMessage]);
        } else {
             http_response_code(200);
             echo json_encode(['success' => true, 'message' => 'Message sent, but retrieval failed.']);
        }

    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to send message.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
?>