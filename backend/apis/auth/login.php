<?php

include "../../config/Connect.php"; // Ensure this path is correct

// CORS Headers - Consider making these more specific in production
header('Access-Control-Allow-Origin: http://localhost:3000'); // Allow your React dev server origin
header('Access-Control-Allow-Credentials: true'); // Crucial for sessions/cookies
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Allow POST and OPTIONS
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With'); // Allow necessary headers
header('Content-Type: application/json');

// Handle preflight OPTIONS request (browser sends this before POST with credentials)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

// Start session *before* any output if using sessions
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}


$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);

$params_ok = TRUE;

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
    $params_ok = FALSE;
}

if (!$params_ok) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email and password'
    ]);
    exit;
}


try {
    // Fetch profile_picture as well
    $cmd = "SELECT user_id, username, password_hash, email, profile_picture FROM users WHERE email = ?";
    $stmt = $dbh->prepare($cmd);

    $args = [$email];
    $stmt->execute($args); // No need for $success check here, fetch() handles no results

    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) { // Use FETCH_ASSOC for clarity
        // Verify the password
        if (password_verify($password, $row['password_hash'])) {
            // Password is correct, REGENERATE session ID for security
            session_regenerate_id(true);

            // Store info in session
            $_SESSION['user_id'] = $row['user_id'];
            $_SESSION['user_email'] = $row['email'];
            $_SESSION['user_username'] = $row['username'];
            $_SESSION['user_profile_picture'] = $row['profile_picture']; // Store profile picture
            $_SESSION['logged_in'] = true;

            // Send successful response including profile picture
            echo json_encode([
                'success' => true,
                'message' => 'Login successful!',
                'user' => [
                    'id' => $row['user_id'],
                    'email' => $row['email'],
                    'username' => $row['username'],
                    'profile_picture' => $row['profile_picture'] // Include in response
                ]
            ]);
        } else {
            // Password does not match
            http_response_code(401); // Unauthorized
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password. Please try again.'
            ]);
        }
    } else {
        // No user found with that email
        http_response_code(401); // Unauthorized
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password. Please try again.'
        ]);
    }
}
catch (PDOException $e) { // Catch specific DB errors
    error_log("Database Error: " . $e->getMessage()); // Log the actual error
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'success' => false,
        'message' => 'Login Failed! A server error occurred.' // User-friendly message
    ]);
}
catch (Exception $e) { // Catch other general errors
    error_log("General Error: " . $e->getMessage()); // Log the actual error
    http_response_code(500); // Internal Server Error
     echo json_encode([
        'success' => false,
        'message' => 'Login Failed! An unexpected error occurred.' // User-friendly message
    ]);
}
?>