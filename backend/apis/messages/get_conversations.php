<?php

/**
 * File:         get_conversations.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 3rd, 2025
 * Description:  Fetches a list of conversations for the logged-in user.
 */

include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include '../../config/connect.php';
include '../../models/MessageModel.php';
include '../auth/auth_check.php';

$loggedInUserId = null;
if (function_exists('require_login')) {
   try { $loggedInUserId = require_login(); }
   catch (Exception $e) {
      http_response_code(401); echo json_encode(['success' => false, 'error' => 'Not authenticated']); exit;
   }
} else {
   http_response_code(500); echo json_encode(['success' => false, 'error' => 'Auth system error.']); exit;
}

$messageModel = new Message($dbh);
$conversations = $messageModel->getConversations($loggedInUserId);

foreach ($conversations as &$convo) {
    if (!empty($convo['lastMessageTimestamp'])) {
        try { // Keep try-catch for DateTime as it can throw errors
             $date = new DateTimeImmutable($convo['lastMessageTimestamp']);
             $convo['lastMessageTimestamp'] = $date->format('M d, H:i');
        } catch (Exception $e) {
             $convo['lastMessageTimestamp'] = 'Invalid Date';
        }
    }

    $convo['unread'] = isset($convo['unreadCount']) && $convo['unreadCount'] > 0;
    unset($convo['unreadCount']);
}
unset($convo);

echo json_encode($conversations);

exit;