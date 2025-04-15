<?php
// Standard headers
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

$loggedInUserId = require_login(); // Ensure user is logged in and get their ID

try {
    $messageModel = new Message($dbh);
    $conversations = $messageModel->getConversations($loggedInUserId);

    // Format timestamps if desired (e.g., relative time or specific format)
    // This can also be done on the frontend
    foreach ($conversations as &$convo) {
         // Example: Format timestamp - adapt as needed
        if ($convo['lastMessageTimestamp']) {
            $date = new DateTime($convo['lastMessageTimestamp']);
             // Simple example: just date and time
            $convo['lastMessageTimestamp'] = $date->format('M d, H:i');
        }
        // Map unreadCount to boolean for the frontend component
         $convo['unread'] = ($convo['unreadCount'] ?? 0) > 0;
         unset($convo['unreadCount']); // Remove the count if frontend only needs boolean
    }


    echo json_encode($conversations);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>