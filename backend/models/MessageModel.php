<?php
class Message {
    private $dbh;
    private $table = 'messages';
    private $userTable = 'users';

    public function __construct($dbConnection) {
        $this->dbh = $dbConnection;
    }

    public function getConversations($userId) {
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

    public function getMessagesBetweenUsers($userId1, $userId2) {
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

    public function sendMessage($senderId, $receiverId, $content) {
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

    public function deleteConversation($userId1, $userId2) {
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

    public function markMessagesAsRead($receiverId, $senderId) {
         $sql = "UPDATE {$this->table}
                SET is_read = TRUE
                WHERE receiver_id = :receiverId AND sender_id = :senderId AND is_read = FALSE";
        $stmt = $this->dbh->prepare($sql);
        $stmt->bindParam(':receiverId', $receiverId, PDO::PARAM_INT);
        $stmt->bindParam(':senderId', $senderId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function getMessageById($messageId) {
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
?>