<?php
// Standard headers (similar, but allow POST or DELETE method)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS'); // Allow POST/DELETE for simplicity or RESTfulness
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

 // Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include '../../config/Connect.php';
include '../../models/MessageModel.php';
include '../../services/auth_check.php';

$loggedInUserId = require_login();

// Get data from POST request body (assuming JSON)
$data = json_decode(file_get_contents('php://input'), true);
$otherUserId = filter_var($data['other_user_id'] ?? null, FILTER_VALIDATE_INT);

if (!$otherUserId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing other_user_id.']);
    exit;
}

try {
    $messageModel = new Message($dbh);
    $success = $messageModel->deleteConversation($loggedInUserId, $otherUserId);

    if ($success) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Conversation deleted.']);
    } else {
        // This could happen if there were no messages, which isn't really an error
        // Or if the delete query failed for some reason
         http_response_code(200); // Or 500 if failure is critical
         echo json_encode(['success' => true, 'message' => 'Conversation deleted or did not exist.']);
        // If you want to distinguish failure:
        // http_response_code(500);
        // echo json_encode(['success' => false, 'error' => 'Failed to delete conversation.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
?>