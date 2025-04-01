<?php
// Start session to access session data
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Set CORS headers - Adjust origin for production
header('Access-Control-Allow-Origin: http://localhost:3000'); // Your React app's origin
header('Access-Control-Allow-Credentials: true'); // Important for cookies/session
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Allow POST and OPTIONS
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');


// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

// --- Logout Logic ---

// 1. Unset all session variables
$_SESSION = array();

// 2. If session cookies are used, expire the cookie.
// Note: This will destroy the session, and not just the session data!
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, // Set expiry in the past
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 3. Finally, destroy the session.
session_destroy();

// --- Send Response ---
// It's generally okay to always return success, as the goal is to be logged out.
// Even if the session didn't exist, the client is now effectively logged out.
echo json_encode(['success' => true, 'message' => 'Logout successful.']);

exit; // Terminate script
?>