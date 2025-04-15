<?php
// Standard headers (same as get_conversations.php)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

 // Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include '../../config/connect.php';
include '../../models/MessageModel.php';
include './auth_check.php';

$loggedInUserId = require_login();

// Get the ID of the other user in the conversation from query parameter
$otherUserId = filter_input(INPUT_GET, 'other_user_id', FILTER_VALIDATE_INT);

if (!$otherUserId) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Missing or invalid other_user_id parameter.']);
    exit;
}

try {
    $messageModel = new Message($dbh);
    $messages = $messageModel->getMessagesBetweenUsers($loggedInUserId, $otherUserId);

    // Format timestamps and prepare data for frontend
    $formattedMessages = [];
    foreach ($messages as $msg) {
         $date = new DateTime($msg['sent_at']);
         $formattedMessages[] = [
             'id' => $msg['message_id'], // Use actual message ID
             'senderId' => $msg['sender_id'],
             'receiverId' => $msg['receiver_id'],
             'senderName' => $msg['senderName'],
             'senderAvatar' => $msg['senderAvatar'] ?? 'https://i.pravatar.cc/150?img=10', // Default avatar
             'text' => $msg['content'],
             'timestamp' => $date->format('H:i A'), // Example: 10:30 AM
             'isRead' => (bool)$msg['is_read']
         ];
    }

    echo json_encode($formattedMessages);

    // Optionally mark messages as read after fetching them
    $messageModel->markMessagesAsRead($loggedInUserId, $otherUserId);


} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>