<?php
include "../../config/Connect.php";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_SPECIAL_CHARS);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);
$datetime = date("y-m-d h:i:s");

$errors = [];

if (empty($username)) {
    $errors[] = 'Username is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if (empty($password)) {
    $errors[] = 'Password is required';
} elseif (strlen($password) < 8) {
    $errors[] = 'Password must be at least 8 characters long';
}

// If there are validation errors, return them
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $errors)
    ]);
    exit;
}

try {
    // First checking is any users exist with the entered email
    $cmd = "SELECT COUNT(*) FROM users WHERE email = ?";
    $stmt = $dbh->prepare($cmd);

    $args = [$email];
    $stmt->execute($args);

    if ($stmt->fetchColumn() > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Email already in use. Please try a different email or login.'
        ]);
        exit;
    }

    // Checking if the username is already in use
    $cmd = "SELECT COUNT(*) FROM users WHERE username = ?";
    $stmt = $dbh->prepare($cmd);

    $args = [$username];
    $stmt->execute($args);

    if ($stmt->fetchColumn() > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Username already taken. Please choose a different username.'
        ]);
        exit;
    }

    // Hashing password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Creating new account
    $cmd = "INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)";
    $stmt = $dbh->prepare($cmd);

    $args = [$username, $email, $hashed_password, $datetime];
    $success = $stmt->execute($args);

    // Checking if it was successful
    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful! You can now log in with your credentials.'
        ]);
    }
    else {
        echo json_encode([
            'success' => true,
            'message' => 'Registration failed due to a system error. Please try again later.'
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => "Registration failed due to a system error. Please try again later. $datetime"
    ]);
}
?>