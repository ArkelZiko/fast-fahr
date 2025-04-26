<?php

/**
 * File:         register.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 20th, 2025
 * Description:  Handles new user registration requests. Validates input, checks for
 *               existing email/username, hashes the password, and inserts the new
 *               user into the database.
 */

include "../../config/connect.php";
include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Setting variables with user inputs
$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_SPECIAL_CHARS);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);
$datetime = date("y-m-d h:i:s");

// Declaring an empty errors array.
$errors = [];

// Checking if the username is empty
if (empty($username)) {
    $errors[] = 'Username is required';
}

// Checking if the email is valid
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

// Checking if the password is valid
if (empty($password)) {
    $errors[] = 'Password is required';
} elseif (strlen($password) < 8) {
    $errors[] = 'Password must be at least 8 characters long';
}

// Checking if there were any errors stored in the array
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $errors)
    ]);
    exit;
}

// try-catch
try {
    // Setting up SQL query command for emails
    $cmd = "SELECT COUNT(*) FROM users WHERE email = ?";
    $stmt = $dbh->prepare($cmd);

    $args = [$email];
    $stmt->execute($args);

    // Checking if the SQL query returned any emails
    if ($stmt->fetchColumn() > 0) {
        // JSON response saying email already exists
        echo json_encode([
            'success' => false,
            'message' => 'Email already in use. Please try a different email or login.'
        ]);
        exit;
    }

    // Setting up SQL query command for usernames
    $cmd = "SELECT COUNT(*) FROM users WHERE username = ?";
    $stmt = $dbh->prepare($cmd);

    $args = [$username];
    $stmt->execute($args);

    // Checking if the SQL query returned any usernames
    if ($stmt->fetchColumn() > 0) {
        // JSOn response saying the username is already taken
        echo json_encode([
            'success' => false,
            'message' => 'Username already taken. Please choose a different username.'
        ]);
        exit;
    }

    // Hashing password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Preparing SQL command to add the new user with username, email, password hash, and datetime of when account was created
    $cmd = "INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)";
    $stmt = $dbh->prepare($cmd);

    $args = [$username, $email, $hashed_password, $datetime];
    $success = $stmt->execute($args);

    // Checking if the command was successful
    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful! You can now log in with your credentials.'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'Registration failed due to a system error. Please try again later.'
        ]);
    }
} catch (Exception $e) {
    // JSON Response if something went wrong
    echo json_encode([
        'success' => false,
        'message' => "Registration failed due to a system error. Please try again later. $datetime"
    ]);
}
