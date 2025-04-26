<?php

/**
 * File:         get_listings.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 4th, 2025
 * Description:  Fetches all car listings with main image and creator username.
 */

include __DIR__ . '/../../config/connect.php';
include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

$cmd = "
    SELECT
        p.id, p.user_id, u.username AS creator_username,
        p.title, p.make, p.model, p.year, p.price, p.mileage,
        p.created_at, p.description, p.transmission, p.fuelType,
        p.driveType, p.bodyType, p.exteriorColor, p.province, p.city,
        pi.image_path
    FROM posts p
    JOIN users u ON p.user_id = u.user_id
    LEFT JOIN post_images pi ON p.id = pi.post_id AND pi.is_main = 1
    ORDER BY p.created_at DESC;
";

$stmt = $dbh->prepare($cmd);
$stmt->execute();
$listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($listings);

exit;