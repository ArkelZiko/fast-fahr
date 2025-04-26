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

// Checking if a session exists
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Checking if the user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please log in to access this resource.'
    ]);
    exit;
}

// Setting user id based on the session data
$user_id = $_SESSION['user_id'];

// Check if a picture was uploaded successfully.
if (!isset($_FILES['profilePicture']) || $_FILES['profilePicture']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'No file uploaded or upload error occurred.'
    ]);
    exit;
}

// Setting up variables based on where the profile picture is going to be stored on the server
// and its requirements.
$upload_dir = dirname(__DIR__, 3) . '/uploads/profile_pictures/';
$web_path = '/fastfahr/uploads/profile_pictures/';
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
$max_size = 5 * 1024 * 1024;

// Checking if the file exists
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Setting new variables
$file = $_FILES['profilePicture'];
$file_name = $file['name'];
$file_tmp = $file['tmp_name'];
$file_size = $file['size'];
$file_type = $file['type'];

// Checking if the uploaded file is an allowed image type
if (!in_array($file_type, $allowed_types)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Only JPG, PNG, and GIF files are allowed.'
    ]);
    exit;
}

// Checking if the file exceeds the maximum allowed size of 5MB
if ($file_size > $max_size) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'File size exceeds the limit of 5MB.'
    ]);
    exit;
}

// Creating a unique filename for the uploaded image
$new_filename = $user_id . '_' . uniqid() . '.' . pathinfo($file_name, PATHINFO_EXTENSION);
// Create the full server file path to store the image
$upload_path = $upload_dir . $new_filename;
// Create the web accessible URL for the image
$image_url = $web_path . $new_filename;

try {

    // Checking if the server was able to move the uploaded file from the temporary directory to the permanent location
    if (move_uploaded_file($file_tmp, $upload_path)) {
        // Prepare SQL command to update the user's profile picture URL in the database
        $cmd = "UPDATE users SET profile_picture = ? WHERE user_id = ?";
        $stmt = $dbh->prepare($cmd);
        $args = [$image_url, $user_id];
        $success = $stmt->execute($args);

        // Checking if the SQL command was successful.
        if ($success) {
            $_SESSION['user_profile_picture'] = $image_url;

            echo json_encode([
                'success' => true,
                'message' => 'Profile picture updated successfully!',
                'profile_picture' => $image_url
            ]);
        } else {
            // Delete the uploaded file if the database update fails
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
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred.'
    ]);
}
