<?php

/**
 * File:         image_listings.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 22nd, 2025
 * Description:  Fetches all image paths for a given post ID.
 */

include '../../config/connect.php';
include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$postId = filter_input(INPUT_GET, 'post_id', FILTER_VALIDATE_INT);
if (!$postId) {
    http_response_code(400);
    echo json_encode(["error" => "Missing or invalid post_id."]);
    exit;
}

$cmd = "SELECT image_path FROM post_images WHERE post_id = ?";
$stmt = $dbh->prepare($cmd);
$params = [$postId];
$stmt->execute($params);
$images = $stmt->fetchAll(PDO::FETCH_COLUMN);

echo json_encode($images);

exit;