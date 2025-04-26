<?php

 /**
  * File:         get_profile.php
  * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
  * MACIDs:       alamy1, govindag, kharodg, zikoa
  * Date:         April 25th, 2025
  * Description:  Fetches the current user's profile information.
  */
 
 include __DIR__ . '/../../config/connect.php';
 include __DIR__ . '/../auth/auth_check.php';
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
 
 $loggedInUserId = null;
 if (function_exists('require_login')) {
    try { $loggedInUserId = require_login(); }
    catch (Exception $e) {
       http_response_code(401); echo json_encode(['success' => false, 'error' => 'Not authenticated']); exit;
    }
 } else {
    http_response_code(500); echo json_encode(['success' => false, 'error' => 'Auth system error.']); exit;
 }
 
 $cmd = "SELECT username, email, profile_picture FROM users WHERE user_id = ?";
 $stmt = $dbh->prepare($cmd);
 $params = [$loggedInUserId];
 $stmt->execute($params);
 $row = $stmt->fetch(PDO::FETCH_ASSOC);
 
 if ($row) {
     echo json_encode([
         'success' => true,
         'user' => [
             'username' => $row['username'],
             'email' => $row['email'],
             'profile_picture' => $row['profile_picture'] ?? 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
         ]
     ]);
 } else {
     http_response_code(404);
     echo json_encode(['success' => false, 'message' => 'User profile not found.']);
 }
 
 exit;