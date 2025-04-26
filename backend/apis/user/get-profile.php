<?php

/**
 * File:         get-profile.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 25th, 2025
 * Description:  Fetches the current user's profile information from the database.
 *               Requires an active session with a logged-in user.
 */

include "../../config/Connect.php";
include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Checking session status
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Checking if the user is logged in or not
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    // HTTP response 401 and JSON encoded response
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please log in to access this resource.'
    ]);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];

    // Preparing SQL command to select the users information
    $cmd = "SELECT username, email, profile_picture FROM users WHERE user_id = ?";
    $stmt = $dbh->prepare($cmd);

    $args = [$user_id];
    $stmt->execute($args);

    // Checking if the SQL query recieved a user
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // JSON encoded response with the users info.
        echo json_encode([
            'success' => true,
            'user' => [
                'username' => $row['username'],
                'email' => $row['email'],
                'profile_picture' => $row['profile_picture']
            ]
        ]);
    } else {
        // HTTP response 404 with JSON encoded response that the User was not found
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'User not found.'
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
