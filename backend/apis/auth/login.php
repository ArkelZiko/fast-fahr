<?php

/**
 * File:         login.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 20th, 2025
 * Description:  Handles user login requests. Verifies email and password against
 *               the database, starts a session, and returns user data on success.
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

// Checking Session status
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Setting variables
$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);

// Variable to check if the inputted parameters are valid
$params_ok = TRUE;

// Checking if the parameters are valid, i.e. not empty, no invalid entries.
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
    $params_ok = FALSE;
}

// If parameters check is not valid then give back response 400 with JSON encoded message 
if (!$params_ok) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email and password'
    ]);
    exit;
}

// try catch
try {
    // Select query for the 'users' table with email
    $cmd = "SELECT user_id, username, password_hash, email, profile_picture FROM users WHERE email = ?";
    $stmt = $dbh->prepare($cmd);

    $args = [$email];
    $stmt->execute($args);

    // Checking if an entry was returned
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Using password_verify to check if the users entered password, and the hash on the database match
        if (password_verify($password, $row['password_hash'])) {
            // Regenerating the session ID
            session_regenerate_id(true);

            // Setting the SESSION variables
            $_SESSION['user_id'] = $row['user_id'];
            $_SESSION['user_email'] = $row['email'];
            $_SESSION['user_username'] = $row['username'];
            $_SESSION['user_profile_picture'] = $row['profile_picture'];
            $_SESSION['logged_in'] = true;

            // Encoding the JSON response
            echo json_encode([
                'success' => true,
                'message' => 'Login successful!',
                'user' => [
                    'id' => $row['user_id'],
                    'email' => $row['email'],
                    'username' => $row['username'],
                    'profile_picture' => $row['profile_picture']
                ]
            ]);
        } else {
            // If passwords do not match, send response 401 with JSON encoded message
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password. Please try again.'
            ]);
        }
    } else {
        // If no query was found with the email, send response 401 with JSON encoded message
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password. Please try again.'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Login Failed! A server error occurred.'
    ]);
}