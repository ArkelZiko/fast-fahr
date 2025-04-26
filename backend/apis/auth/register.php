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
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_SPECIAL_CHARS);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);
$datetime = date("Y-m-d H:i:s");

$errors = [];
if (empty($username)) { $errors[] = 'Username is required'; }
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors[] = 'Valid email is required'; }
if (empty($password)) { $errors[] = 'Password is required'; }
elseif (strlen($password) < 8) { $errors[] = 'Password must be at least 8 characters long'; }

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

$cmd_email = "SELECT COUNT(*) FROM users WHERE email = ?";
$stmt_email = $dbh->prepare($cmd_email);
$params_email = [$email];
$stmt_email->execute($params_email);
if ($stmt_email->fetchColumn() > 0) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Email already in use.']);
    exit;
}

$cmd_user = "SELECT COUNT(*) FROM users WHERE username = ?";
$stmt_user = $dbh->prepare($cmd_user);
$params_user = [$username];
$stmt_user->execute($params_user);

if ($stmt_user->fetchColumn() > 0) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Username already taken.']);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$cmd_insert = "INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)";
$stmt_insert = $dbh->prepare($cmd_insert);
$params_insert = [$username, $email, $hashed_password, $datetime];
$success = $stmt_insert->execute($params_insert);

if ($success) {
    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Registration successful! You will be redirected.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Registration failed due to a server error.']);
}

exit;