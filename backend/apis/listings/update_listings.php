<?php

/**
 * File:         update_listing.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 23rd, 2025
 * Description:  Handles updating listing using filter_input and positional placeholders.
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

$loggedInUserId = null;
if (function_exists('require_login')) {
   try { $loggedInUserId = require_login(); }
   catch (Exception $e) {
      http_response_code(401); echo json_encode(['success' => false, 'error' => 'Not authenticated']); exit;
   }
} else {
   http_response_code(500); echo json_encode(['success' => false, 'error' => 'Auth system error.']); exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed.']);
    exit;
}

$listingId = filter_input(INPUT_POST, 'listing_id', FILTER_VALIDATE_INT);
$title = trim(filter_input(INPUT_POST, 'title', FILTER_SANITIZE_SPECIAL_CHARS) ?: '');
$make = trim(filter_input(INPUT_POST, 'make', FILTER_SANITIZE_SPECIAL_CHARS) ?: '');
$model = trim(filter_input(INPUT_POST, 'model', FILTER_SANITIZE_SPECIAL_CHARS) ?: '');
$description = trim(filter_input(INPUT_POST, 'description', FILTER_SANITIZE_SPECIAL_CHARS) ?: '');
$transmission = trim(filter_input(INPUT_POST, 'transmission', FILTER_SANITIZE_SPECIAL_CHARS) ?: '');
$fuelType = trim(filter_input(INPUT_POST, 'fuelType', FILTER_SANITIZE_SPECIAL_CHARS) ?: '');
$driveType = trim(filter_input(INPUT_POST, 'driveType', FILTER_SANITIZE_SPECIAL_CHARS) ?: '');
$bodyType = trim(filter_input(INPUT_POST, 'bodyType', FILTER_SANITIZE_SPECIAL_CHARS) ?: '');
$exteriorColor = trim(filter_input(INPUT_POST, 'exteriorColor', FILTER_SANITIZE_SPECIAL_CHARS) ?: '');
$province = trim(filter_input(INPUT_POST, 'province', FILTER_SANITIZE_SPECIAL_CHARS) ?: '');
$city = trim(filter_input(INPUT_POST, 'city', FILTER_SANITIZE_SPECIAL_CHARS) ?: '');

$year = filter_input(INPUT_POST, 'year', FILTER_VALIDATE_INT);
$price = filter_input(INPUT_POST, 'price', FILTER_VALIDATE_FLOAT);
$mileage_str = filter_input(INPUT_POST, 'mileage', FILTER_SANITIZE_SPECIAL_CHARS);
$mileage = filter_var(str_replace(',', '', $mileage_str), FILTER_VALIDATE_INT);
$mainPhotoIndex_input = filter_input(INPUT_POST, 'mainPhotoIndex', FILTER_VALIDATE_INT);
$mainPhotoIndex = ($mainPhotoIndex_input === false || $mainPhotoIndex_input < 0) ? 0 : $mainPhotoIndex_input;

$errors = [];
if ($listingId === false || $listingId <= 0) { $errors[] = 'Valid Listing ID'; }
if (empty($title)) { $errors[] = 'Title'; }
if (empty($make)) { $errors[] = 'Make'; }
if (empty($model)) { $errors[] = 'Model'; }
if ($year === false || $year <= 1900) { $errors[] = 'Valid Year'; }
if ($price === false || $price < 0) { $errors[] = 'Valid Price'; }
if ($mileage === false || $mileage < 0) { $errors[] = 'Valid Mileage'; }
if (empty($description)) { $errors[] = 'Description'; }
if (empty($transmission)) { $errors[] = 'Transmission'; }
if (empty($fuelType)) { $errors[] = 'Fuel Type'; }
if (empty($driveType)) { $errors[] = 'Drive Type'; }
if (empty($bodyType)) { $errors[] = 'Body Type'; }
if (empty($exteriorColor)) { $errors[] = 'Exterior Color'; }
if (empty($province)) { $errors[] = 'Province'; }
if (empty($city)) { $errors[] = 'City'; }

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing or invalid fields: ' . implode(', ', $errors)]);
    exit;
}

if (empty($_FILES['photos']['name'][0])) {
     http_response_code(400);
     echo json_encode(['success' => false, 'error' => 'Please upload new photos when editing.']);
     exit;
}

$dbh->beginTransaction();

$cmdOwner = "SELECT user_id FROM posts WHERE id = ?";
$stmtOwner = $dbh->prepare($cmdOwner);
$stmtOwner->execute([$listingId]);
$ownerId = $stmtOwner->fetchColumn();

if ($ownerId === false || (int)$ownerId !== $loggedInUserId) {
    $dbh->rollBack();
    $statusCode = ($ownerId === false) ? 404 : 403;
    http_response_code($statusCode);
    echo json_encode(['success' => false, 'error' => 'Listing not found or permission denied.']);
    exit;
}

$cmdUpdate = "UPDATE posts SET title=?, make=?, model=?, year=?, price=?, mileage=?, description=?, transmission=?, fuelType=?, driveType=?, bodyType=?, exteriorColor=?, province=?, city=? WHERE id = ? AND user_id = ?";
$stmtUpdate = $dbh->prepare($cmdUpdate);
$paramsUpdate = [
    $title, $make, $model, $year, $price, $mileage, $description,
    $transmission, $fuelType, $driveType, $bodyType, $exteriorColor,
    $province, $city,
    $listingId, $loggedInUserId
];
$successUpdate = $stmtUpdate->execute($paramsUpdate);

if (!$successUpdate) {
    $dbh->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to update listing details.']);
    exit;
}

$cmdDeleteImages = "DELETE FROM post_images WHERE post_id = ?";
$stmtDeleteImages = $dbh->prepare($cmdDeleteImages);
$stmtDeleteImages->execute([$listingId]);

$mainImagePath = null;
$uploadedImagePaths = [];
$uploadDir = dirname(__DIR__, 3) . '/uploads';
if (!is_dir($uploadDir)) { mkdir($uploadDir, 0755, true); }

$files = $_FILES['photos'];
$imageInsertCount = 0;
$cmdImage = "INSERT INTO post_images (post_id, image_path, is_main) VALUES (?, ?, ?)";
$stmtImage = $dbh->prepare($cmdImage);

for ($i = 0; $i < count($files['name']); $i++) {
     if ($files['error'][$i] === UPLOAD_ERR_OK) {
        $tmpName = $files['tmp_name'][$i];
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        if (!in_array($finfo->file($tmpName), ['image/jpeg', 'image/png'])) { continue; }

        $originalName = basename($files['name'][$i] ?? 'img');
        $safeOriginalName = preg_replace("/[^a-zA-Z0-9._-]/", "_", $originalName);
        $extension = pathinfo($safeOriginalName, PATHINFO_EXTENSION);
        $uniqueName = uniqid('img_', true) . '.' . ($extension ?: 'jpg');
        $imagePath = '/uploads/' . $uniqueName;
        $destination = $uploadDir . '/' . $uniqueName;

        if (move_uploaded_file($tmpName, $destination)) {
            $isMain = ($i === $mainPhotoIndex) ? 1 : 0;
            if ($isMain) $mainImagePath = $imagePath;
            $imageParams = [$listingId, $imagePath, $isMain];
            if ($stmtImage->execute($imageParams)) {
                $uploadedImagePaths[] = $imagePath;
                $imageInsertCount++;
            } else { unlink($destination); }
        }
    }
}

if ($imageInsertCount === 0) {
    $dbh->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save new listing images.']);
    exit;
}

if ($mainImagePath === null && !empty($uploadedImagePaths)) { $mainImagePath = $uploadedImagePaths[0]; }

$dbh->commit();

$updatedListingData = [
    'id' => $listingId, 'user_id' => $loggedInUserId,
    'title' => $title, 'make' => $make, 'model' => $model, 'year' => $year,
    'price' => $price, 'mileage' => $mileage,
    'city' => $city, 'province' => $province,
    'description' => $description, 'transmission' => $transmission,
    'fuelType' => $fuelType, 'driveType' => $driveType, 'bodyType' => $bodyType,
    'exteriorColor' => $exteriorColor,
    'image_path' => $mainImagePath ?: '/images/default-car.png'
];

echo json_encode([
    'success' => true,
    'message' => 'Listing updated successfully.',
    'updatedListing' => $updatedListingData
]);

exit;