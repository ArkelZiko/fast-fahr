<?php

/**
 * File:         save_listings.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 14th, 2025
 * Description:  Handles the creation of new car listings including
 *               saving vehicle data to the posts.sql table (not POST)  
 *               and processing several image uploads using the FormData object
*/

include __DIR__ . '/../../config/connect.php';
include __DIR__ . '/../auth/auth_check.php'; 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$loggedInUserId = require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST requests are allowed.']);
    exit;
}

$requiredFields = [
    'title', 'make', 'model', 'year', 'price', 'mileage',
    'description', 'transmission', 'fuelType', 'driveType',
    'bodyType', 'exteriorColor', 'province', 'city'
];

foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing or empty field: $field"]);
        exit;
    }
}

try {
    $stmt = $dbh->prepare("
        INSERT INTO posts (
        user_id, title, make, model, year, price, mileage,
        description, transmission, fuelType,
        driveType, bodyType, exteriorColor, province,
        city)
        VALUES
        (:user_id, :title, :make, :model, :year, :price, :mileage,
        :description, :transmission, :fuelType,
        :driveType, :bodyType, :exteriorColor, :province,
        :city)
    ");

    $stmt->execute([
        ':user_id' => $loggedInUserId,
        ':title' => $_POST['title'],
        ':make' => $_POST['make'],
        ':model' => $_POST['model'],
        ':year' => (int) $_POST['year'],
        ':price' => (float) $_POST['price'],
        ':mileage' => (int) str_replace(',', '', $_POST['mileage']),
        ':description' => $_POST['description'],
        ':transmission' => $_POST['transmission'],
        ':fuelType' => $_POST['fuelType'],
        ':driveType' => $_POST['driveType'],
        ':bodyType' => $_POST['bodyType'],
        ':exteriorColor' => $_POST['exteriorColor'],
        ':province' => $_POST['province'],
        ':city' => $_POST['city'],
    ]);

    $listingId = $dbh->lastInsertId();

    if (!empty($_FILES['photos'])) {
        $uploadDir = __DIR__ . '/../../../uploads';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $files = $_FILES['photos'];
        $mainIndex = isset($_POST['mainPhotoIndex']) ? (int) $_POST['mainPhotoIndex'] : 0;

        for ($i = 0; $i < count($files['name']); $i++) {
            if ($files['error'][$i] === UPLOAD_ERR_OK) {
                $tmpName = $files['tmp_name'][$i];
                $originalName = preg_replace("/[^a-zA-Z0-9._-]/", "_", basename($files['name'][$i]));
                $uniqueName = uniqid('img_', true) . '_' . $originalName;
                $imagePath = '/uploads/' . $uniqueName;
                $destination = $uploadDir . '/' . $uniqueName;

                if (move_uploaded_file($tmpName, $destination)) {
                    $isMain = ($i === $mainIndex) ? 1 : 0;
                    $insertImg = $dbh->prepare("
                        INSERT INTO post_images (post_id, image_path, is_main)
                        VALUES (:post_id, :image_path, :is_main)
                    ");
                    $insertImg->execute([
                        ':post_id' => $listingId,
                        ':image_path' => $imagePath,
                        ':is_main' => $isMain
                    ]);
                }
            }
        }
    }

    echo json_encode(['success' => true, 'message' => 'Listing saved successfully.', 'listingId' => $listingId]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    if ($e->getMessage() === 'User not logged in') {
         http_response_code(401);
    } else {
        http_response_code(500);
    }
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}

?>