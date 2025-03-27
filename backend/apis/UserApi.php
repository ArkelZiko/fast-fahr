<?php
// Enable CORS to allow cross-origin requests (NEED THIS EVERYWHERE)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/Connect.php';

try {
    $stmt = $dbh->prepare("SELECT name FROM users WHERE id = 1");
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo json_encode(["message" => $user['name']]);
    } else {
        echo json_encode(["message" => "No user found"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>