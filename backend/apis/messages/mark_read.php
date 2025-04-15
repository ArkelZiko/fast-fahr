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
$senderId = filter_var($data['sender_id'] ?? null, FILTER_VALIDATE_INT);

if (!$senderId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing sender_id.']);
    exit;
}

try {
    $messageModel = new Message($dbh);
    $success = $messageModel->markMessagesAsRead($loggedInUserId, $senderId);

    if ($success) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Messages marked as read.']);
    } else {
         http_response_code(200);
         echo json_encode(['success' => true, 'message' => 'Messages marked as read or none were unread.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
?>