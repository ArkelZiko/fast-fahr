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
include './auth_check.php';

$loggedInUserId = require_login();

// Get data from POST request body (assuming JSON)
$data = json_decode(file_get_contents('php://input'), true);

$receiverId = filter_var($data['receiver_id'] ?? null, FILTER_VALIDATE_INT);
$content = trim(filter_var($data['content'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS)); // Basic sanitization

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
         // Fetch the newly created message to return complete data to frontend
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
                 'isRead' => false // It's new, so definitely not read by receiver yet
             ];
            http_response_code(201); // Created
            echo json_encode(['success' => true, 'message' => 'Message sent.', 'newMessage' => $formattedMessage]);
        } else {
             // Message was inserted but couldn't be retrieved immediately (unlikely)
             http_response_code(200); // Still OK, technically sent
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