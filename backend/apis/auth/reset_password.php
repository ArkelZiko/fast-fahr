<?php

/**
 * File:         reset_password.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 6th, 2025 
 * Description:  Handles the actual password reset action. Validates token/password,
 *               updates the password hash, and deletes the used token.
 */

include "../../config/connect.php";
include "../../models/UserModel.php";
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
$newPassword = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($plainToken) || empty($newPassword)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email, token, and new password are required.']);
    exit;
}
if (strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long.']);
    exit;
}

$userModel = new User($dbh);
$passwordResetModel = new PasswordReset($dbh);

$resetData = $passwordResetModel->validateResetToken($email, $plainToken);

if ($resetData !== false) {
    $userId = $resetData['user_id'];
    $resetId = $resetData['id'];
    $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

    if ($userModel->updatePassword($userId, $newPasswordHash)) {
        $passwordResetModel->deleteTokenById($resetId);
        echo json_encode(['success' => true, 'message' => 'Password updated successfully.']);
    } else {

        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update password.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid or expired reset token.']);
}

exit;