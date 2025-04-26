<?php

/**
 * File:         update_profile_picture.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 25th, 2025 (Refactored April 23rd, 2025)
 * Description:  Handles profile picture uploads.
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

if (session_status() == PHP_SESSION_NONE) { 
    session_start(); 
}

$loggedInUserId = null;
if (function_exists('require_login')) {
   try { $loggedInUserId = require_login(); }
   catch (Exception $e) {
      http_response_code(401); echo json_encode(['success' => false, 'error' => 'Not authenticated']); exit;
   }
} else {
   http_response_code(500); echo json_encode(['success' => false, 'error' => 'Auth system error.']); exit;
}

if (!isset($_FILES['profilePicture']) || $_FILES['profilePicture']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    $uploadErrors = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds upload_max_filesize.',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds MAX_FILE_SIZE.',
        UPLOAD_ERR_PARTIAL    => 'File only partially uploaded.',
        UPLOAD_ERR_NO_FILE    => 'No file was uploaded.',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder.',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk.',
        UPLOAD_ERR_EXTENSION  => 'PHP extension stopped the upload.',
    ];
    $errorCode = $_FILES['profilePicture']['error'] ?? UPLOAD_ERR_NO_FILE;
    $message = $uploadErrors[$errorCode] ?? 'Unknown upload error.';
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

$upload_dir_base = dirname(__DIR__, 3) . '/uploads';
$upload_subdir = '/profile_pictures/';             
$upload_dir = $upload_dir_base . $upload_subdir;  
$web_path_base = '/fastfahr/uploads';             
$web_path_subdir = '/profile_pictures/';          
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
$max_size = 5 * 1024 * 1024; // 5 MB

// Create directory if needed
if (!is_dir($upload_dir) && !mkdir($upload_dir, 0755, true) && !is_dir($upload_dir)) {
     http_response_code(500);
     echo json_encode(['success' => false, 'message' => 'Failed to create upload directory.']);
     exit;
}

$file = $_FILES['profilePicture'];
$file_tmp = $file['tmp_name'];
$file_size = $file['size'];
$file_type = $file['type'];

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime_type = $finfo->file($file_tmp);
if (!in_array($mime_type, $allowed_types)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, GIF allowed.']);
    exit;
}

if ($file_size > $max_size) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'File size exceeds 5MB limit.']);
    exit;
}

$file_extension = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg';
$new_filename = $loggedInUserId . '_' . uniqid() . '.' . strtolower($file_extension);
$upload_path = $upload_dir . $new_filename;
$image_url = $web_path_base . $web_path_subdir . $new_filename;

// Attempt to move the file
if (move_uploaded_file($file_tmp, $upload_path)) {
    $cmd_update = "UPDATE users SET profile_picture = ? WHERE user_id = ?";
    $stmt_update = $dbh->prepare($cmd_update);
    $params_update = [$image_url, $loggedInUserId];
    $success_db = $stmt_update->execute($params_update);

    if ($success_db) {
        // Update successful, update session
        $_SESSION['user_profile_picture'] = $image_url;
        echo json_encode([
            'success' => true,
            'message' => 'Profile picture updated!',
            'profile_picture' => $image_url
        ]);
    } else {
        unlink($upload_path);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update database record.']);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save uploaded file.']);
}

exit;