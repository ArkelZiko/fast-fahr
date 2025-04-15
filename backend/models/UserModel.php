<?php
class User {
    private $dbh;
    private $table = 'users';

    public function __construct($dbConnection) {
        $this->dbh = $dbConnection;
    }

    public function getUserById($id) {
        $stmt = $this->dbh->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getUserByUsername($username) {
        $stmt = $this->dbh->prepare("SELECT user_id, username, profile_picture FROM {$this->table} WHERE username = :username");
        $stmt->execute(['username' => $username]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getUserDetails($userId) {
         $stmt = $this->dbh->prepare("SELECT user_id, username, profile_picture FROM {$this->table} WHERE user_id = :id");
         $stmt->execute(['id' => $userId]);
         return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Finds a user by their email address.
     *
     * @param string $email The email address to search for.
     * @return array|false User data array (user_id, email, username) or false if not found.
     */
    public function getUserByEmail(string $email): array|false {
        try {
            // Adjust selected columns if needed
            $sql = "SELECT user_id, email, username FROM {$this->table} WHERE email = :email LIMIT 1";
            $stmt = $this->dbh->prepare($sql);
            $params = [':email' => $email];
            $execute = $stmt->execute($params);

            if ($execute) {
                return $stmt->fetch(PDO::FETCH_ASSOC); // Returns false if no row is found
            } else {
                 error_log("Failed to execute getUserByEmail query for email: " . $email);
                 return false;
            }
        } catch (PDOException $e) {
            error_log("Database error in getUserByEmail: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Updates the password hash for a given user ID.
     *
     * @param int    $userId The ID of the user to update.
     * @param string $newPasswordHash The new, already hashed password.
     * @return bool True if the update was successful (at least 1 row affected), false otherwise.
     */
    public function updatePassword(int $userId, string $newPasswordHash): bool {
        try {
            // Assumes your password column is named 'password_hash'
            $sql = "UPDATE {$this->table} SET password_hash = :password_hash WHERE user_id = :user_id";
            $stmt = $this->dbh->prepare($sql);
            $params = [
                ':password_hash' => $newPasswordHash,
                ':user_id' => $userId
            ];
            $execute = $stmt->execute($params);

            if ($execute && $stmt->rowCount() > 0) {
                return true;
            } else {
                if (!$execute) {
                     error_log("Failed to execute updatePassword query for user ID: " . $userId);
                } else {
                     error_log("Password update query executed but did not affect any rows for user ID: " . $userId);
                }
                return false;
            }
        } catch (PDOException $e) {
            error_log("Database error in updatePassword for user ID $userId: " . $e->getMessage());
            return false;
        }
    }
}
?>