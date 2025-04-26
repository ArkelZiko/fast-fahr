<?php

/**
 * File:         save_listings.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 14th, 2025
 * Description:  Handles creation of new car listings using filter_input and positional placeholders.
 */

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
    echo json_encode(['success' => false, 'error' => 'Only POST requests are allowed.']);
    exit;
}

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
    echo json_encode(['success' => false, 'error' => 'At least one photo is required.']);
    exit;
}

$postParams = [
    $loggedInUserId, $title, $make, $model, $year, $price, $mileage,
    $description, $transmission, $fuelType, $driveType, $bodyType,
    $exteriorColor, $province, $city
];

$dbh->beginTransaction();

$cmdPost = "INSERT INTO posts (user_id, title, make, model, year, price, mileage, description, transmission, fuelType, driveType, bodyType, exteriorColor, province, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmtPost = $dbh->prepare($cmdPost);
$successPost = $stmtPost->execute($postParams);
$listingId = $dbh->lastInsertId();

if (!$successPost || !$listingId) {
    $dbh->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save listing data.']);
    exit;
}

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
            } else {
                 unlink($destination);
            }
        }
    }
}

if ($imageInsertCount === 0) {
    $dbh->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save listing images.']);
    exit;
}

if ($mainImagePath === null && !empty($uploadedImagePaths)) { $mainImagePath = $uploadedImagePaths[0]; }

$dbh->commit();

$newListingData = [
    'id' => (int)$listingId, 'user_id' => $loggedInUserId,
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
    'message' => 'Listing saved successfully.',
    'listingId' => $listingId,
    'newListing' => $newListingData
]);

exit;