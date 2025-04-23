<?php

/**
 * File:         verify_code.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 6th, 2025
 * Description:  Verifies if a password reset code (token) provided by the user
 *               is valid and not expired for the given email address. Does not
 *               change the password itself.
 */

include "../../config/connect.php";
include "../../models/PasswordResetModel.php";
include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(204); exit; }

$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
$plainToken = filter_input(INPUT_POST, "token", FILTER_SANITIZE_SPECIAL_CHARS);

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($plainToken)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and reset code are required.']);
    exit;
}

try {
    $passwordResetModel = new PasswordReset($dbh);
} catch (InvalidArgumentException | PDOException $e) {
     error_log("Error instantiating model or DB connection: " . $e->getMessage());
     http_response_code(500);
     echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
     exit;
}

try {
    $isValid = $passwordResetModel->validateResetToken($email, $plainToken);

    if ($isValid !== false) {
        echo json_encode(['success' => true, 'message' => 'Code verified successfully.']);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired reset code. Please request a new one.']);
    }

} catch (Exception $e) {
    error_log("General Error in verify_code.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred during code verification.']);
}
?>