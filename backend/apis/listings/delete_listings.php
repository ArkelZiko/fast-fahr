<?php

include __DIR__ . '/../../config/connect.php';
include __DIR__ . '/../auth/auth_check.php';
include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {

    $loggedInUserId = require_login();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new Exception('Only POST allowed.');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $listingIdToDelete = filter_var($data['listing_id'] ?? null, FILTER_VALIDATE_INT);

    if (!$listingIdToDelete) {
        http_response_code(400);
        throw new Exception('Missing or invalid listing ID.');
    }

    $deleteQuery = "DELETE FROM posts WHERE id = ? AND user_id = ?";
    $deleteStmt = $dbh->prepare($deleteQuery);
    $params = [$listingIdToDelete, $loggedInUserId];
    $success = $deleteStmt->execute($params);

    if ($success) {
        if ($deleteStmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Listing deleted.']);
        } else {
             http_response_code(404);
             throw new Exception('Listing not found or delete permission denied.');
        }
    } else {
        http_response_code(500);
        throw new Exception('Database error during deletion process.');
    }

} catch (Exception $e) {
    $errorCode = 500;
    if ($e->getMessage() === 'User not logged in') $errorCode = 401;
    if ($e->getMessage() === 'Missing or invalid listing ID.') $errorCode = 400;
    if ($e->getMessage() === 'Listing not found or delete permission denied.') $errorCode = 404;

    http_response_code($errorCode);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>