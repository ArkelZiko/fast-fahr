<?php

/**
 * File:         update-info.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 25th, 2025
 * Description:  Updates a user's profile information (username and email).
 *               Validates input and checks for duplicate usernames/emails.
 */

include "../../config/connect.php";
include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Checking if session exists
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Checking if the user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please log in to access this resource.'
    ]);
    exit;
}

// Setting variable from Session
$user_id = $_SESSION['user_id'];

// Setting variables based on the INPUT recieved.
$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);

// Declaring an empty errors array
$errors = [];

// Checking if the username is empty
if (empty($username)) {
    $errors[] = 'Username is required';
}

// Checking if the email is valid
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

// Checking if there were any errors
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $errors)
    ]);
    exit;
}

try {
    // Checking if the email received is different from the one from the session
    if ($email !== $_SESSION['user_email']) {
        // Preparing SQL query to check if the new email is already taken by a different user.
        $cmd = "SELECT COUNT(*) FROM users WHERE email = ? AND user_id != ?";
        $stmt = $dbh->prepare($cmd);
        $args = [$email, $user_id];
        $stmt->execute($args);

        // Checking if the SQL query found the email exists with another user.
        if ($stmt->fetchColumn() > 0) {
            // HTTP response 409 with JSON encoded response that the email is already in use
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'message' => 'Email already in use by another account.'
            ]);
            exit;
        }
    }

    // Checking if the username recieved is different from the session.
    if ($username !== $_SESSION['user_username']) {
        // Preparing SQL query to check if the new username is already taken by a different user.
        $cmd = "SELECT COUNT(*) FROM users WHERE username = ? AND user_id != ?";
        $stmt = $dbh->prepare($cmd);
        $args = [$username, $user_id];
        $stmt->execute($args);

        // Checking if the SQL query found the username exists with another user.
        if ($stmt->fetchColumn() > 0) {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'message' => 'Username already taken by another account.'
            ]);
            exit;
        }
    }

    // Preparing SQL command to update username and or email for the current user.
    $cmd = "UPDATE users SET username = ?, email = ? WHERE user_id = ?";
    $stmt = $dbh->prepare($cmd);
    $args = [$username, $email, $user_id];
    $success = $stmt->execute($args);

    // Checking if the SQL command was successful
    if ($success) {
        $_SESSION['user_username'] = $username;
        $_SESSION['user_email'] = $email;

        // JSON Success response
        echo json_encode([
            'success' => true,
            'message' => 'Profile information updated successfully!'
        ]);
    } else {
        // HTTP response 500 and JSON failed response
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update profile information.'
        ]);
    }
} catch (Exception $e) {
    // HTTP Response 500 with JSON encoded response of database error
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred: ' . $e->getMessage()
    ]);
}
