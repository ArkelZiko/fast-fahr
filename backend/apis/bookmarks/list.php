<?php
include "../../config/connect.php";
include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$loggedInUserId = $_SESSION['user_id'];

try {
    $sql = "
      SELECT
          p.*,                   -- Select all columns from posts
          u.username AS creator_username, -- Get the username from the users table
          pi.image_path        -- Select the main image path
      FROM posts p
      JOIN users u ON p.user_id = u.user_id      -- Join users table to get username
      JOIN bookmarks b ON p.id = b.post_id       -- Join bookmarks to filter
      LEFT JOIN post_images pi ON p.id = pi.post_id AND pi.is_main = 1 -- Left join for main image
      WHERE b.user_id = :user_id                 -- Filter by logged-in user ID
      ORDER BY b.created_at DESC
    ";

    $stmt = $dbh->prepare($sql);
    $stmt->bindParam(':user_id', $loggedInUserId, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
      'success' => true,
      'data'    => $rows
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error occurred while fetching bookmarks.']);

} catch (Exception $e) {
    error_log("General Error in bookmarks/list.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An unexpected server error occurred.']);
}
?>