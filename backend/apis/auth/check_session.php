<?php

/**
 * File:         check_session.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 25th, 2025
 * Description:  API endpoint called by the frontend (likely on page load/refresh)
 *               to check if a valid user session exists. Returns user details
 *               if logged in, otherwise indicates the user is not logged in.
 */

session_start();

include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true && isset($_SESSION['user_id'])) {
    echo json_encode([
        'isLoggedIn' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['user_email'] ?? null,
            'username' => $_SESSION['user_username'] ?? null,
            'profile_picture' => $_SESSION['user_profile_picture'] ?? 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
        ]
    ]);
} else {
    echo json_encode(['isLoggedIn' => false]);
}
?>