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

try {
    $messageModel = new Message($dbh);
    $conversations = $messageModel->getConversations($loggedInUserId);

    foreach ($conversations as &$convo) {
        if ($convo['lastMessageTimestamp']) {
            $date = new DateTime($convo['lastMessageTimestamp']);
            $convo['lastMessageTimestamp'] = $date->format('M d, H:i');
        }

         $convo['unread'] = ($convo['unreadCount'] ?? 0) > 0;
         unset($convo['unreadCount']);
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