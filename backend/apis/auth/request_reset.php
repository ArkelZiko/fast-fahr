<?php

/**
 * File:         request_reset.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 5th, 2025
 * Description:  Handles password reset requests. Validates email, generates a reset
 *               token, stores it (or its hash) in the database, and sends an email
 *               containing the reset code/token to the user using PHPMailer.
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';
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

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide a valid email address.']);
    exit;
}

try {
    $userModel = new User($dbh);
    $passwordResetModel = new PasswordReset($dbh);
} catch (InvalidArgumentException | PDOException $e) {
    error_log("Error instantiating models or DB connection: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
    exit;
}


try {
    $user = $userModel->getUserByEmail($email);

    if ($user) {
        $userId = $user['user_id'];

        // Note: Below is code from the phpmailer documentation
        $plainToken = $passwordResetModel->createResetToken($userId, $email);

        if ($plainToken) {
            $mail = new PHPMailer(true);
            try {
                // --- Server settings ---
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'fast.fahr.help@gmail.com';
                $mail->Password = 'kuhq dpao ftye ejxg';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                $mail->Port = 465;

                // --- Recipients ---
                $mail->setFrom('fast.fahr.help@gmail.com', 'FastFahr');
                $mail->addAddress($email);

                // --- Content ---
                $mail->isHTML(true);
                $mail->Subject = 'FastFahr Password Reset Request';

                $mail->Body    = "Hello,<br><br>You requested a password reset. Use the code below (expires in 1 hour):<br><br>"
                    . "<b>Code: " . htmlspecialchars($plainToken) . "</b><br><br>"
                    . "If you didn't request this, please ignore this email.<br><br>Thanks,<br>The FastFahr Team";
                $mail->AltBody = "Hello,\n\nYou requested a password reset. Use the code below (expires in 1 hour):\n\n"
                    . "Code: " . $plainToken . "\n\n"
                    . "If you didn't request this, ignore this email.\n\nThanks,\nThe FastFahr Team";

                $mail->send();
            } catch (Exception $e) {
                error_log("PHPMailer Error sending reset email to $email: {$mail->ErrorInfo}");
                $passwordResetModel->deleteTokensForUser($userId);
            }
        } else {
            error_log("Failed to generate password reset token for email: $email");
        }
    }

    echo json_encode(['success' => true, 'message' => 'If an account with that email exists, a password reset link has been sent.']);
} catch (Exception $e) {
    error_log("General Error in request_reset.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An unexpected server error occurred.']);
}
