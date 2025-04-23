<?php

/**
 * File:         reset_password.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 6th, 2025
 * Description:  Handles the actual password reset action. Validates the provided
 *               email, reset token, and new password. If the token is valid and
 *               not expired, it updates the user's password hash in the database
 *               and deletes the used token.
 */

include "../../config/connect.php";
include "../../models/UserModel.php";
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
$newPassword = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($plainToken) || empty($newPassword)) {
    http_response_code(400); echo json_encode(['success' => false, 'message' => 'Email, token, and new password are required.']); exit;
}

if (strlen($newPassword) < 8) {
    http_response_code(400); echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long.']); exit;
}

try {
    $userModel = new User($dbh);
    $passwordResetModel = new PasswordReset($dbh);
} catch (InvalidArgumentException | PDOException $e) {
     error_log("Error instantiating models or DB connection: " . $e->getMessage());
     http_response_code(500); echo json_encode(['success' => false, 'message' => 'Server configuration error.']); exit;
}

try {

    $resetData = $passwordResetModel->validateResetToken($email, $plainToken);

    if ($resetData !== false) {
        $userId = $resetData['user_id'];
        $resetId = $resetData['id'];
        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

        if ($userModel->updatePassword($userId, $newPasswordHash)) {
            $passwordResetModel->deleteTokenById($resetId);
            echo json_encode(['success' => true, 'message' => 'Your password has been successfully updated. You can now log in.']);

        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update password due to a server error.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired reset token. Please start the process again.']);
    }

} catch (Exception $e) {
    error_log("General Error in reset_password.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An unexpected server error occurred while resetting the password.']);
}
?>