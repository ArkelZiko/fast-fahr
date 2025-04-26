<?php

/**
 * File:         update-profile-picture.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 25th, 2025
 * Description:  Handles profile picture uploads. Validates the file,
 *               saves it, and updates user profile reference.
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

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please log in to access this resource.'
    ]);
    exit;
}

$user_id = $_SESSION['user_id'];

if (!isset($_FILES['profilePicture']) || $_FILES['profilePicture']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'No file uploaded or upload error occurred.'
    ]);
    exit;
}

$upload_dir = dirname(__DIR__, 3) . '/uploads/profile_pictures/';
$web_path = '/fastfahr/uploads/profile_pictures/';
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
$max_size = 5 * 1024 * 1024; 

if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

$file = $_FILES['profilePicture'];
$file_name = $file['name'];
$file_tmp = $file['tmp_name'];
$file_size = $file['size'];
$file_type = $file['type'];

if (!in_array($file_type, $allowed_types)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Only JPG, PNG, and GIF files are allowed.'
    ]);
    exit;
}

if ($file_size > $max_size) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'File size exceeds the limit of 5MB.'
    ]);
    exit;
}

$new_filename = $user_id . '_' . uniqid() . '.' . pathinfo($file_name, PATHINFO_EXTENSION);
$upload_path = $upload_dir . $new_filename;
$image_url = $web_path . $new_filename;

try {
    if (move_uploaded_file($file_tmp, $upload_path)) {
        $cmd = "UPDATE users SET profile_picture = ? WHERE user_id = ?";
        $stmt = $dbh->prepare($cmd);
        $args = [$image_url, $user_id];
        $success = $stmt->execute($args);

        if ($success) {
            $_SESSION['user_profile_picture'] = $image_url;

            echo json_encode([
                'success' => true,
                'message' => 'Profile picture updated successfully!',
                'profile_picture' => $image_url
            ]);
        } else {
            unlink($upload_path);

            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update profile information in the database.'
            ]);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to upload file. Please try again.'
        ]);
    }
} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'A database error occurred. Please try again later.'
    ]);
} catch (Exception $e) {
    error_log("General Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred.'
    ]);
}
