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

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please log in to access this resource.'
    ]);
    exit;
}

$user_id = $_SESSION['user_id'];

$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);

$errors = [];

if (empty($username)) {
    $errors[] = 'Username is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $errors)
    ]);
    exit;
}

try {
    if ($email !== $_SESSION['user_email']) {
        $cmd = "SELECT COUNT(*) FROM users WHERE email = ? AND user_id != ?";
        $stmt = $dbh->prepare($cmd);
        $args = [$email, $user_id];
        $stmt->execute($args);

        if ($stmt->fetchColumn() > 0) {
            http_response_code(409); 
            echo json_encode([
                'success' => false,
                'message' => 'Email already in use by another account.'
            ]);
            exit;
        }
    }

    if ($username !== $_SESSION['user_username']) {
        $cmd = "SELECT COUNT(*) FROM users WHERE username = ? AND user_id != ?";
        $stmt = $dbh->prepare($cmd);
        $args = [$username, $user_id];
        $stmt->execute($args);

        if ($stmt->fetchColumn() > 0) {
            http_response_code(409); 
            echo json_encode([
                'success' => false,
                'message' => 'Username already taken by another account.'
            ]);
            exit;
        }
    }

    $cmd = "UPDATE users SET username = ?, email = ? WHERE user_id = ?";
    $stmt = $dbh->prepare($cmd);
    $args = [$username, $email, $user_id];
    $success = $stmt->execute($args);

    if ($success) {
        $_SESSION['user_username'] = $username;
        $_SESSION['user_email'] = $email;

        echo json_encode([
            'success' => true,
            'message' => 'Profile information updated successfully!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update profile information.'
        ]);
    }
} catch (PDOException $e) {
    error_log("Database Error in update-info.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("General Error in update-info.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred: ' . $e->getMessage()
    ]);
}
