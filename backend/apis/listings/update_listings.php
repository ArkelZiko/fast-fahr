<?php

/**
 * File:         update_listings.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 23rd, 2025
 * Description:  Handles updating an existing car listing. Updates post details,
 *               deletes all old images associated with the post, and saves
 *               newly uploaded images. Verifies user ownership.
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
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server Error: DB Connection failed.']);
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
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed.']);
    exit;
}

if (empty($_POST['listing_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing listing_id.']);
    exit;
}
if (empty($_FILES['photos']['name'][0])) {
     http_response_code(400);
     echo json_encode(['success' => false, 'error' => 'Please upload new photos.']);
     exit;
}


$listingId = (int) $_POST['listing_id'];

try {
    $dbh->beginTransaction();

    $checkOwnerStmt = $dbh->prepare("SELECT user_id FROM posts WHERE id = :id");
    $checkOwnerStmt->execute([':id' => $listingId]);
    if ((int)$checkOwnerStmt->fetchColumn() !== $loggedInUserId) {
        throw new Exception("Permission denied.", 403);
    }

    $updateStmt = $dbh->prepare("
        UPDATE posts SET
            title = :title, make = :make, model = :model, year = :year,
            price = :price, mileage = :mileage, description = :description,
            transmission = :transmission, fuelType = :fuelType, driveType = :driveType,
            bodyType = :bodyType, exteriorColor = :exteriorColor, province = :province,
            city = :city
        WHERE id = :id AND user_id = :user_id
    ");
    $updateStmt->execute([
        ':id' => $listingId,
        ':user_id' => $loggedInUserId,
        ':title' => trim($_POST['title'] ?? ''),
        ':make' => trim($_POST['make'] ?? ''),
        ':model' => trim($_POST['model'] ?? ''),
        ':year' => (int) ($_POST['year'] ?? 0),
        ':price' => (float) ($_POST['price'] ?? 0.0),
        ':mileage' => (int) str_replace(',', '', $_POST['mileage'] ?? '0'),
        ':description' => trim($_POST['description'] ?? ''),
        ':transmission' => trim($_POST['transmission'] ?? ''),
        ':fuelType' => trim($_POST['fuelType'] ?? ''),
        ':driveType' => trim($_POST['driveType'] ?? ''),
        ':bodyType' => trim($_POST['bodyType'] ?? ''),
        ':exteriorColor' => trim($_POST['exteriorColor'] ?? ''),
        ':province' => trim($_POST['province'] ?? ''),
        ':city' => trim($_POST['city'] ?? ''),
    ]);

    $deleteImagesStmt = $dbh->prepare("DELETE FROM post_images WHERE post_id = :post_id");
    $deleteImagesStmt->execute([':post_id' => $listingId]);

    $mainImagePath = null;
    $uploadedImagePaths = [];
    $uploadDir = dirname(__DIR__, 3) . '/uploads';
    if (!is_dir($uploadDir)) { mkdir($uploadDir, 0755, true); }

    $files = $_FILES['photos'];
    $mainIndex = isset($_POST['mainPhotoIndex']) ? (int) $_POST['mainPhotoIndex'] : 0;
    $imageInsertCount = 0;

    $insertImgStmt = $dbh->prepare("
        INSERT INTO post_images (post_id, image_path, is_main)
        VALUES (:post_id, :image_path, :is_main)
    ");

    for ($i = 0; $i < count($files['name']); $i++) {
        if ($files['error'][$i] === UPLOAD_ERR_OK) {
            $tmpName = $files['tmp_name'][$i];
            $finfo = new finfo(FILEINFO_MIME_TYPE);
             if (!in_array($finfo->file($tmpName), ['image/jpeg', 'image/png'])) {
                continue; // Skip non-images
             }

            $originalName = basename($files['name'][$i] ?? 'uploaded_image');
            $safeOriginalName = preg_replace("/[^a-zA-Z0-9._-]/", "_", $originalName);
            $extension = pathinfo($safeOriginalName, PATHINFO_EXTENSION);
            $uniqueName = uniqid('img_', true) . '.' . ($extension ?: 'jpg');
            $imagePath = '/uploads/' . $uniqueName;
            $destination = $uploadDir . '/' . $uniqueName;

            if (move_uploaded_file($tmpName, $destination)) {
                $isMain = ($i === $mainIndex) ? 1 : 0;
                if ($isMain) $mainImagePath = $imagePath;
                $insertImgStmt->execute([':post_id' => $listingId, ':image_path' => $imagePath, ':is_main' => $isMain]);
                $uploadedImagePaths[] = $imagePath;
                $imageInsertCount++;
            }
        }
    }

    if ($imageInsertCount === 0) {
        throw new Exception("Failed to save any new photos.");
    }
    if ($mainImagePath === null && !empty($uploadedImagePaths)) {
        $mainImagePath = $uploadedImagePaths[0];
    }

    $updatedListingData = [
        'id' => $listingId, 'user_id' => $loggedInUserId,
        'title' => trim($_POST['title'] ?? ''), 'make' => trim($_POST['make'] ?? ''),
        'model' => trim($_POST['model'] ?? ''), 'year' => (int) ($_POST['year'] ?? 0),
        'price' => (float) ($_POST['price'] ?? 0.0),
        'mileage' => (int) str_replace(',', '', $_POST['mileage'] ?? '0'),
        'city' => trim($_POST['city'] ?? ''), 'province' => trim($_POST['province'] ?? ''),
        'description' => trim($_POST['description'] ?? ''),
        'transmission' => trim($_POST['transmission'] ?? ''),
        'fuelType' => trim($_POST['fuelType'] ?? ''),
        'driveType' => trim($_POST['driveType'] ?? ''),
        'bodyType' => trim($_POST['bodyType'] ?? ''),
        'exteriorColor' => trim($_POST['exteriorColor'] ?? ''),
        'image_path' => $mainImagePath ?: '/images/default-car.png'
    ];

    $dbh->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Listing updated successfully.',
        'updatedListing' => $updatedListingData
    ]);

} catch (Exception $e) {
    if ($dbh->inTransaction()) $dbh->rollBack();
    $errorCode = $e->getCode() >= 400 ? $e->getCode() : 500;
    http_response_code($errorCode);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

?>