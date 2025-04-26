<?php

/**
 * File:         MessageModel.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 1st, 2025
 * Description:  Model class for handling database operations related to messages
 *               and conversations (fetching, sending, deleting, marking read).
 */

class Message
{
    private $dbh;
    private $table = 'messages';
    private $userTable = 'users';

    /**
     * Constructor for Message model.
     *
     * @param PDO $dbConnection A PDO database connection object.
     */
    public function __construct($dbConnection)
    {
        $this->dbh = $dbConnection;
    }

    /**
     * Retrieves a list of conversations for a given user, ordered by the most recent message.
     * Includes details of the other participant and unread message count.
     *
     * @param int $userId The ID of the user whose conversations are being fetched.
     * @return array An array of conversation data arrays, or empty array if none.
     */
    public function getConversations($userId)
    {
        $sql = "SELECT
                    u.user_id AS other_user_id,
                    u.username AS userName,
                    u.profile_picture AS userAvatar,
                    m_latest.content AS lastMessage,
                    m_latest.sent_at AS lastMessageTimestamp,
                    m_latest.message_id AS lastMessageId,
                    (SELECT COUNT(*) FROM {$this->table} m_unread
                     WHERE m_unread.receiver_id = :userId
                       AND m_unread.sender_id = u.user_id
                       AND m_unread.is_read = FALSE) AS unreadCount
                FROM
                    (SELECT
                         IF(sender_id = :userId, receiver_id, sender_id) AS other_user,
                         MAX(message_id) AS max_message_id
                     FROM {$this->table}
                     WHERE sender_id = :userId OR receiver_id = :userId
                     GROUP BY other_user
                    ) AS m_unique
                JOIN {$this->table} m_latest ON m_unique.max_message_id = m_latest.message_id
                JOIN {$this->userTable} u ON m_unique.other_user = u.user_id
                ORDER BY m_latest.sent_at DESC";

        $stmt = $this->dbh->prepare($sql);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Retrieves all messages exchanged between two specific users, ordered chronologically.
     * Includes sender details for each message.
     *
     * @param int $userId1 The ID of the first user.
     * @param int $userId2 The ID of the second user.
     * @return array An array of message data arrays, or empty array if none.
     */
    public function getMessagesBetweenUsers($userId1, $userId2)
    {
        $sql = "SELECT
                    m.message_id, m.sender_id, m.receiver_id, m.content, m.sent_at, m.is_read,
                    u_sender.username AS senderName,
                    u_sender.profile_picture AS senderAvatar
                FROM {$this->table} m
                JOIN {$this->userTable} u_sender ON m.sender_id = u_sender.user_id
                WHERE
                    (m.sender_id = :userId1 AND m.receiver_id = :userId2)
                    OR
                    (m.sender_id = :userId2 AND m.receiver_id = :userId1)
                ORDER BY m.sent_at ASC";

        $stmt = $this->dbh->prepare($sql);
        $stmt->bindParam(':userId1', $userId1, PDO::PARAM_INT);
        $stmt->bindParam(':userId2', $userId2, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Inserts a new message into the database.
     *
     * @param int    $senderId The ID of the user sending the message.
     * @param int    $receiverId The ID of the user receiving the message.
     * @param string $content The text content of the message.
     * @return int|false The ID of the newly inserted message on success, or false on failure.
     */
    public function sendMessage($senderId, $receiverId, $content)
    {
        $sql = "INSERT INTO {$this->table} (sender_id, receiver_id, content, sent_at, is_read)
                VALUES (:senderId, :receiverId, :content, NOW(), FALSE)";
        $stmt = $this->dbh->prepare($sql);
        $stmt->bindParam(':senderId', $senderId, PDO::PARAM_INT);
        $stmt->bindParam(':receiverId', $receiverId, PDO::PARAM_INT);
        $stmt->bindParam(':content', $content, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return $this->dbh->lastInsertId();
        } else {
            return false;
        }
    }

    /**
     * Deletes all messages exchanged between two specified users.
     *
     * @param int $userId1 The ID of the first user.
     * @param int $userId2 The ID of the second user.
     * @return bool True if the deletion query executed successfully, false otherwise.
     *              Note: This doesn't guarantee rows were deleted, only that the query ran.
     */
    public function deleteConversation($userId1, $userId2)
    {
        $sql = "DELETE FROM {$this->table}
                WHERE
                    (sender_id = :userId1 AND receiver_id = :userId2)
                    OR
                    (sender_id = :userId2 AND receiver_id = :userId1)";
        $stmt = $this->dbh->prepare($sql);
        $stmt->bindParam(':userId1', $userId1, PDO::PARAM_INT);
        $stmt->bindParam(':userId2', $userId2, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Marks all unread messages from a specific sender to a specific receiver as read.
     *
     * @param int $receiverId The ID of the user who received the messages (usually the logged-in user).
     * @param int $senderId The ID of the user who sent the messages.
     * @return bool True if the update query executed successfully, false otherwise.
     */
    public function markMessagesAsRead($receiverId, $senderId)
    {
        $sql = "UPDATE {$this->table}
                SET is_read = TRUE
                WHERE receiver_id = :receiverId AND sender_id = :senderId AND is_read = FALSE";
        $stmt = $this->dbh->prepare($sql);
        $stmt->bindParam(':receiverId', $receiverId, PDO::PARAM_INT);
        $stmt->bindParam(':senderId', $senderId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Retrieves the details of a single message by its unique ID.
     * Includes sender information.
     *
     * @param int $messageId The ID of the message to retrieve.
     * @return array|false An associative array of the message data if found, false otherwise.
     */
    public function getMessageById($messageId)
    {
        $sql = "SELECT
                    m.message_id, m.sender_id, m.receiver_id, m.content, m.sent_at, m.is_read,
                    u_sender.username AS senderName,
                    u_sender.profile_picture AS senderAvatar
                FROM {$this->table} m
                JOIN {$this->userTable} u_sender ON m.sender_id = u_sender.user_id
                WHERE m.message_id = :messageId";
        $stmt = $this->dbh->prepare($sql);
        $stmt->bindParam(':messageId', $messageId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
