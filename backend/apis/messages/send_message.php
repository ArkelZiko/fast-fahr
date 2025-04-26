<?php

/**
 * File:         send_message.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 3rd, 2025
 * Description:  Handles sending a new message.
 */

include __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CORS_ORIGIN']);
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include '../../config/connect.php';
include '../../models/MessageModel.php';
include '../auth/auth_check.php';

$data = json_decode(file_get_contents('php://input'), true);
$receiverId = filter_var($data['receiver_id'] ?? null, FILTER_VALIDATE_INT);
$content = trim($data['content'] ?? '');
$content = filter_var($content, FILTER_SANITIZE_SPECIAL_CHARS);


if (!$receiverId || empty($content)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing or invalid receiver_id or content.']);
    exit;
}

if ($receiverId === $loggedInUserId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Cannot send messages to yourself.']);
    exit;
}

$messageModel = new Message($dbh);
$newMessageId = $messageModel->sendMessage($loggedInUserId, $receiverId, $content);

if ($newMessageId) {
    $newMessageData = $messageModel->getMessageById($newMessageId);
    if ($newMessageData) {
         try {
            $date = new DateTimeImmutable($newMessageData['sent_at']);
             // Use ISO 8601 format for better JS compatibility
            $timestamp = $date->format(DateTime::ATOM);
        } catch (Exception $e) {
            $timestamp = date(DateTime::ATOM);
        }

        $formattedMessage = [
            'id'           => $newMessageData['message_id'],
            'senderId'     => $newMessageData['sender_id'],
            'receiverId'   => $newMessageData['receiver_id'],
            'senderName'   => $newMessageData['senderName'],
            'senderAvatar' => $newMessageData['senderAvatar'] ?? 'https://i.pravatar.cc/150?u=a042581f4e29026704d', // Default avatar
            'text'         => $newMessageData['content'],
            'timestamp'    => $timestamp,
            'isRead'       => false // New message is initially unread
        ];

        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Message sent.', 'newMessage' => $formattedMessage]);
    } 
}

exit;