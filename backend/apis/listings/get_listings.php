<?php

/**
 * File:         get_listings.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 4th, 2025
 * Description:  Fetches all car listings from 2 different tables in the db
 *               1. posts table provides the car info (make, model, price, etc.)
 *               2. post_images table has the attatched image(s) to a given car
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

try {
    $stmt = $dbh->prepare("
        SELECT
            p.id,
            p.user_id,
            u.username AS creator_username, -- Get the username from the users table
            p.title,
            p.make,
            p.model,
            p.year,
            p.price,
            p.mileage,
            p.created_at,
            p.description,
            p.transmission,
            p.fuelType,
            p.driveType,
            p.bodyType,
            p.exteriorColor,
            p.province,
            p.city,
            pi.image_path
        FROM posts p
        JOIN users u ON p.user_id = u.user_id -- Join posts with users
        LEFT JOIN post_images pi
            ON p.id = pi.post_id
            AND pi.is_main = 1
        ORDER BY p.created_at DESC;
    ");

    $stmt->execute();
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($listings);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database error occurred. Please check server logs."
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "An unexpected server error occurred."
    ]);
}

?>