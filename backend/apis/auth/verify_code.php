<?php

/**
* File:         verify_code.php
* Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
* MACIDs:       alamy1, govindag, kharodg, zikoa
* Date:         April 6th, 2025
* Description:  Verifies if a password reset code (token) is valid and not expired.
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

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
$plainToken = filter_input(INPUT_POST, "token", FILTER_SANITIZE_SPECIAL_CHARS);

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($plainToken)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and reset code are required.']);
    exit;
}

$passwordResetModel = new PasswordReset($dbh);

$isValid = $passwordResetModel->validateResetToken($email, $plainToken);

if ($isValid !== false) {
    echo json_encode(['success' => true, 'message' => 'Code verified successfully.']);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid or expired reset code.']);
}

exit;