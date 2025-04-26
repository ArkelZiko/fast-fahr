<?php

/**
 * File:         update_info.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 25th, 2025 (Refactored April 23rd, 2025)
 * Description:  Updates a user's profile information (username and email).
 */

include __DIR__ . '/../../config/connect.php';
include __DIR__ . '/../auth/auth_check.php';
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

if (session_status() == PHP_SESSION_NONE) { session_start(); }
$loggedInUserId = null;
if (function_exists('require_login')) {
   try { $loggedInUserId = require_login(); }
   catch (Exception $e) {
      http_response_code(401); echo json_encode(['success' => false, 'error' => 'Not authenticated']); exit;
   }
} else {
   http_response_code(500); echo json_encode(['success' => false, 'error' => 'Auth system error.']); exit;
}

$username = trim(filter_input(INPUT_POST, "username", FILTER_SANITIZE_SPECIAL_CHARS) ?: '');
$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);

$errors = [];
if (empty($username)) { $errors[] = 'Username is required'; }
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors[] = 'Valid email is required'; }

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

if ($email !== ($_SESSION['user_email'] ?? '')) {
    $cmd_email = "SELECT COUNT(*) FROM users WHERE email = ? AND user_id != ?";
    $stmt_email = $dbh->prepare($cmd_email);
    $params_email = [$email, $loggedInUserId];
    $stmt_email->execute($params_email);
    if ($stmt_email->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Email already in use by another account.']);
        exit;
    }
}

if ($username !== ($_SESSION['user_username'] ?? '')) {
    $cmd_user = "SELECT COUNT(*) FROM users WHERE username = ? AND user_id != ?";
    $stmt_user = $dbh->prepare($cmd_user);
    $params_user = [$username, $loggedInUserId];
    $stmt_user->execute($params_user);

    if ($stmt_user->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Username already taken by another account.']);
        exit;
    }
}

$cmd_update = "UPDATE users SET username = ?, email = ? WHERE user_id = ?";
$stmt_update = $dbh->prepare($cmd_update);
$params_update = [$username, $email, $loggedInUserId];
$success = $stmt_update->execute($params_update);

if ($success) {
    $_SESSION['user_username'] = $username;
    $_SESSION['user_email'] = $email;

    echo json_encode(['success' => true, 'message' => 'Profile information updated successfully!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update profile information.']);
}

exit;