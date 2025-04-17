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
    // 1 PREPARE
    $stmt = $dbh->prepare("
        INSERT INTO posts (
        title, make, model, year, price, mileage,
        description, transmission, fuelType, 
        driveType, bodyType, exteriorColor, province,
        city)
        VALUES 
        (:title, :make, :model, :year, :price, :mileage,
        :description, :transmission, :fuelType, 
        :driveType, :bodyType, :exteriorColor, :province,
        :city)
    ");

    // 2 EXECUTE
    $stmt->execute([
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

    $listingId = $dbh->lastInsertId(); //using the post ID so the saved image matches the desired car

    // Saving uploaded image portion
    if (!empty($_FILES['photos'])) {
        $uploadDir = __DIR__ . '/../../../uploads'; //images are going to go in the uploads folder
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $files = $_FILES['photos'];
        $mainIndex = isset($_POST['mainPhotoIndex']) ? (int) $_POST['mainPhotoIndex'] : 0;

        // moving each image to the uploads folder then uploaded to the db
        for ($i = 0; $i < count($files['name']); $i++) {
            if ($files['error'][$i] === UPLOAD_ERR_OK) {
                $tmpName = $files['tmp_name'][$i];
                $originalName = preg_replace("/[^a-zA-Z0-9._-]/", "_", basename($files['name'][$i])); //using a regex to clean up any file names that could clash w the url
                $uniqueName = uniqid('img_', true) . '_' . $originalName; //using this method to make no 2 images have same name (avoids overwrites)
                $imagePath = '/uploads' . $uniqueName; //saving the relative path to variable making it easier in the long run
                $destination = $uploadDir . '/' . $uniqueName;

                if (move_uploaded_file($tmpName, $destination)) {
                    // Insert image into the post_images table
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

    echo json_encode(['success' => true, 'message' => 'Listing saved successfully.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
