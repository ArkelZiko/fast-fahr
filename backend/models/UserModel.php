<?php

/**
 * File:         UserModel.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 21st, 2025
 * Description:  Model class for handling database operations related to users
 *               (fetching by ID, username, email, updating password).
 */

class User
{
    private $dbh;
    private $table = 'users';

    /**
     * Constructor for User model.
     *
     * @param PDO $dbConnection A PDO database connection object.
     */
    public function __construct($dbConnection)
    {
        $this->dbh = $dbConnection;
    }

    /**
     * Retrieves all details for a user by their primary key ID.
     * Note: The `id` column name might need adjustment based on actual table structure (e.g., `user_id`).
     *
     * @param int $id The user's primary key ID.
     * @return array|false An associative array of the user data if found, false otherwise.
     */
    public function getUserById($id)
    {
        $stmt = $this->dbh->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Retrieves selected user details (ID, username, avatar) by their username.
     *
     * @param string $username The username to search for.
     * @return array|false An associative array of user data if found, false otherwise.
     */
    public function getUserByUsername($username)
    {
        $stmt = $this->dbh->prepare("SELECT user_id, username, profile_picture FROM {$this->table} WHERE username = :username");
        $stmt->execute(['username' => $username]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Retrieves selected user details (ID, username, avatar) by their user ID.
     * Similar to getUserByUsername but searches by ID.
     *
     * @param int $userId The user's ID.
     * @return array|false An associative array of user data if found, false otherwise.
     */
    public function getUserDetails($userId)
    {
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
    public function getUserByEmail(string $email): array|false
    {
        try {
            $sql = "SELECT user_id, email, username FROM {$this->table} WHERE email = :email LIMIT 1";
            $stmt = $this->dbh->prepare($sql);
            $params = [':email' => $email];
            $execute = $stmt->execute($params);

            if ($execute) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
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
    public function updatePassword(int $userId, string $newPasswordHash): bool
    {
        try {
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
