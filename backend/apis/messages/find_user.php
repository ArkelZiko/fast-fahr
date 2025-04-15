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
include '../../models/UserModel.php'; // Use User model
include './auth_check.php';

$loggedInUserId = require_login();

$usernameToFind = trim(filter_input(INPUT_GET, 'username', FILTER_SANITIZE_SPECIAL_CHARS));

if (empty($usernameToFind)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing username parameter.']);
    exit;
}

try {
    $userModel = new User($dbh);
    $foundUser = $userModel->getUserByUsername($usernameToFind);

    if ($foundUser) {
        // Check if the found user is the logged-in user
         if ($foundUser['user_id'] == $loggedInUserId) {
             http_response_code(400); // Bad request - trying to add self
             echo json_encode(['error' => 'You cannot start a conversation with yourself.']);
             exit;
         }

        // Return necessary user info for the frontend
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $foundUser['user_id'],
                'username' => $foundUser['username'],
                'avatar' => $foundUser['profile_picture'] ?? 'https://i.pravatar.cc/150?img=10' // Default avatar
            ]
        ]);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(['success' => false, 'message' => 'User not found.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
?>