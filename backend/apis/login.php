<?php

include "../config/connect.php";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);

$params_ok = TRUE;

// checking if the email & password are valid
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
    $params_ok = FALSE;
}

// If there are validation errors, return them
if (!$params_ok) {
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email and password'
    ]);
    exit;
}


try {
    $cmd = "SELECT user_id, username, password_hash, email FROM users WHERE email = ?";
    $stmt = $dbh->prepare($cmd);

    $args = [$email];
    $success = $stmt->execute($args);

    if ($row = $stmt->fetch()) {
        // Verify the password
        if (password_verify($password, $row['password_hash'])) {
            // Password is correct, start a session
            session_start();
            $_SESSION['user_id'] = $row['user_id'];
            $_SESSION['user_email'] = $row['email'];
            $_SESSION['user_username'] = $row['username'];
            $_SESSION['logged_in'] = true;
            
            // Send successful response
            echo json_encode([
                'success' => true,
                'message' => 'Login successful!',
                'user' => [
                    'id' => $row['user_id'],
                    'email' => $row['email'],
                    'username' => $row['username']
                ]
            ]);
        } else {
            // Password does not match
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password. Please try again.'
            ]);
        }
    } else {
        // No user found with that email
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password. Please try again.'
        ]);
    }
}
catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Login Failed! Server Error'
    ]);
}
?>