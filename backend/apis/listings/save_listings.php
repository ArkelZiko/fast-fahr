<?php

/**
 * File:         save_listings.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 14th, 2025 (Updated April 23rd, 2025)
 * Description:  Handles the creation of new car listings including
 *               saving vehicle data to the posts table and processing
 *               image uploads. Returns the new listing data on success.
 */

declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

include __DIR__ . '/../../config/connect.php';
include __DIR__ . '/../auth/auth_check.php';
include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

$origin = $_ENV['CORS_ORIGIN'] ?? '*';
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (!isset($dbh) || !$dbh instanceof PDO) {
    error_log("Database connection (\$dbh) not established in connect.php.");
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Internal Server Error: Database connection failed.']);
    exit;
}

try {
    $loggedInUserId = require_login();
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only POST requests are allowed.']);
    exit;
}

$requiredFields = [
    'title', 'make', 'model', 'year', 'price', 'mileage', 'description',
    'transmission', 'fuelType', 'driveType', 'bodyType', 'exteriorColor',
    'province', 'city'
];
$missingFields = [];
foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        $missingFields[] = $field;
    }
}
if (!empty($missingFields)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields: ' . implode(', ', $missingFields)]);
    exit;
}

$postData = [
    ':user_id' => $loggedInUserId,
    ':title' => trim($_POST['title']),
    ':make' => trim($_POST['make']),
    ':model' => trim($_POST['model']),
    ':year' => (int) $_POST['year'],
    ':price' => (float) $_POST['price'],
    ':mileage' => (int) str_replace(',', '', $_POST['mileage']),
    ':description' => trim($_POST['description']),
    ':transmission' => trim($_POST['transmission']),
    ':fuelType' => trim($_POST['fuelType']),
    ':driveType' => trim($_POST['driveType']),
    ':bodyType' => trim($_POST['bodyType']),
    ':exteriorColor' => trim($_POST['exteriorColor']),
    ':province' => trim($_POST['province']),
    ':city' => trim($_POST['city']),
];

try {
    $dbh->beginTransaction();

    $stmt = $dbh->prepare("
        INSERT INTO posts (
            user_id, title, make, model, year, price, mileage,
            description, transmission, fuelType, driveType,
            bodyType, exteriorColor, province, city
        ) VALUES (
            :user_id, :title, :make, :model, :year, :price, :mileage,
            :description, :transmission, :fuelType, :driveType,
            :bodyType, :exteriorColor, :province, :city
        )
    ");
    $stmt->execute($postData);
    $listingId = $dbh->lastInsertId();

    if (!$listingId) {
        throw new Exception("Failed to retrieve last insert ID for post.");
    }

    $mainImagePath = null;
    $uploadedImagePaths = [];

    if (!empty($_FILES['photos']['name'][0])) {
        $uploadDir = dirname(__DIR__, 3) . '/uploads';
        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
             throw new Exception("Failed to create upload directory: " . $uploadDir);
        }
        if (!is_writable($uploadDir)) {
             throw new Exception("Upload directory is not writable: " . $uploadDir);
        }

        $files = $_FILES['photos'];
        $mainIndex = isset($_POST['mainPhotoIndex']) ? (int) $_POST['mainPhotoIndex'] : 0;
        $imageInsertCount = 0;

        $insertImgStmt = $dbh->prepare("
            INSERT INTO post_images (post_id, image_path, is_main)
            VALUES (:post_id, :image_path, :is_main)
        ");

        for ($i = 0; $i < count($files['name']); $i++) {
            if ($files['error'][$i] !== UPLOAD_ERR_OK) {
                error_log("Upload error for file " . ($files['name'][$i] ?? 'unknown') . ": Error code " . $files['error'][$i]);
                continue;
            }

            $finfo = new finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->file($files['tmp_name'][$i]);
            if ($mimeType !== 'image/jpeg' && $mimeType !== 'image/png') {
                error_log("Invalid file type uploaded: " . ($files['name'][$i] ?? 'unknown') . " (Type: " . $mimeType . ")");
                continue;
            }

            $tmpName = $files['tmp_name'][$i];
            $originalName = basename($files['name'][$i] ?? 'uploaded_image');
            $safeOriginalName = preg_replace("/[^a-zA-Z0-9._-]/", "_", $originalName);
            $extension = pathinfo($safeOriginalName, PATHINFO_EXTENSION);
            $uniqueName = uniqid('img_', true) . '.' . ($extension ?: 'jpg');
            $imagePath = '/uploads/' . $uniqueName;
            $destination = $uploadDir . '/' . $uniqueName;

            if (move_uploaded_file($tmpName, $destination)) {
                $isMain = ($i === $mainIndex) ? 1 : 0;
                if ($isMain) {
                    $mainImagePath = $imagePath;
                }
                $insertImgStmt->execute([
                    ':post_id' => $listingId,
                    ':image_path' => $imagePath,
                    ':is_main' => $isMain
                ]);
                $uploadedImagePaths[] = $imagePath;
                $imageInsertCount++;
            } else {
                error_log("Failed to move uploaded file: " . ($files['name'][$i] ?? 'unknown') . " to destination: " . $destination);
            }
        }

        if ($imageInsertCount === 0 && count($files['name']) > 0) {
             error_log("Warning: Files were submitted, but none were successfully processed for listing ID: " . $listingId);
        }
    } else {
         error_log("No files uploaded for listing ID: " . $listingId);
    }

    if ($mainImagePath === null && !empty($uploadedImagePaths)) {
         $mainImagePath = $uploadedImagePaths[0];
    }

    $newListingData = [
        'id' => (int)$listingId,
        'user_id' => $loggedInUserId,
        'title' => $postData[':title'],
        'make' => $postData[':make'],
        'model' => $postData[':model'],
        'year' => $postData[':year'],
        'price' => $postData[':price'],
        'mileage' => $postData[':mileage'],
        'city' => $postData[':city'],
        'province' => $postData[':province'],
        'description' => $postData[':description'],
        'transmission' => $postData[':transmission'],
        'fuelType' => $postData[':fuelType'],
        'driveType' => $postData[':driveType'],
        'bodyType' => $postData[':bodyType'],
        'exteriorColor' => $postData[':exteriorColor'],
        'image_path' => $mainImagePath ?: '/images/default-car.png'
    ];

    $dbh->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Listing saved successfully.',
        'listingId' => $listingId,
        'newListing' => $newListingData
    ]);

} catch (PDOException $e) {
    $dbh->rollBack();
    http_response_code(500);
    error_log("Database error in save_listings.php: " . $e->getMessage() . " | Post Data: " . json_encode($postData));
    echo json_encode(['success' => false, 'error' => 'Database operation failed. Please try again later.']);

} catch (Exception $e) {
    if ($dbh->inTransaction()) {
       $dbh->rollBack();
    }
    http_response_code(500);
    error_log("Server error in save_listings.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'An unexpected server error occurred: ' . $e->getMessage()]);
}

?>