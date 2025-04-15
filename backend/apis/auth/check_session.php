<?php
session_start();

header('Access-Control-Allow-Origin: *'); // Adjust for production
header('Access-Control-Allow-Credentials: true'); // Important for sessions/cookies
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS'); // Allow GET and preflight OPTIONS
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With'); // Add headers your frontend might send


// Handle preflight OPTIONS request (sent by browser for CORS checks)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}


if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true && isset($_SESSION['user_id'])) {
    echo json_encode([
        'isLoggedIn' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['user_email'] ?? null,
            'username' => $_SESSION['user_username'] ?? null,
            'profile_picture' => $_SESSION['user_profile_picture'] ?? 'https://i.pravatar.cc/150?u=a042581f4e29026704d' // Default if not set
        ]
    ]);
} else {
    echo json_encode(['isLoggedIn' => false]);
}
?>