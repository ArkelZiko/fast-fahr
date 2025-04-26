<?php

/**
 * File:         update-password.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 25th, 2025
 * Description:  Updates a user's password. Verifies current password and
 *               validates the new password before updating.
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

// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please log in to access this resource.'
    ]);
    exit;
}

// Get user ID from session
$user_id = $_SESSION['user_id'];

// Get JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Current password and new password are required.'
    ]);
    exit;
}

$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];

// Validate new password
if (strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'New password must be at least 8 characters long.'
    ]);
    exit;
}

try {
    // Get the current password hash from the database
    $cmd = "SELECT password_hash FROM users WHERE user_id = ?";
    $stmt = $dbh->prepare($cmd);
    $args = [$user_id];
    $stmt->execute($args);

    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $currentPasswordHash = $row['password_hash'];

        // Verify the current password
        if (!password_verify($currentPassword, $currentPasswordHash)) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Current password is incorrect.'
            ]);
            exit;
        }

        // Hash the new password
        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

        // Update the password in the database
        $cmd = "UPDATE users SET password_hash = ? WHERE user_id = ?";
        $stmt = $dbh->prepare($cmd);
        $args = [$newPasswordHash, $user_id];
        $success = $stmt->execute($args);

        if ($success) {
            echo json_encode([
                'success' => true,
                'message' => 'Password updated successfully!'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update password.'
            ]);
        }
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'User not found.'
        ]);
    }
} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'A database error occurred. Please try again later.'
    ]);
} catch (Exception $e) {
    error_log("General Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred.'
    ]);
}
