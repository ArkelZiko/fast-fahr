<?php

/**
* File:         UserModel.php
* Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
* MACIDs:       alamy1, govindag, kharodg, zikoa
* Date:         March 21st, 2025
* Description:  Model class for handling database operations related to users
*               using positional placeholders.
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
    * Retrieves all details for a user by their primary key ID (assuming 'user_id' column).
    *
    * @param int $id The user's ID.
    * @return array|false An associative array of the user data if found, false otherwise.
    */
    public function getUserById($id)
    {
        $cmd = "SELECT * FROM {$this->table} WHERE user_id = ?";
        $stmt = $this->dbh->prepare($cmd);
        $params = [$id];
        $stmt->execute($params);
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
        $cmd = "SELECT user_id, username, profile_picture FROM {$this->table} WHERE username = ?";
        $stmt = $this->dbh->prepare($cmd);
        $params = [$username];
        $stmt->execute($params);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
    * Retrieves selected user details (ID, username, avatar) by their user ID.
    *
    * @param int $userId The user's ID.
    * @return array|false An associative array of user data if found, false otherwise.
    */
    public function getUserDetails($userId)
    {
        $cmd = "SELECT user_id, username, profile_picture FROM {$this->table} WHERE user_id = ?";
        $stmt = $this->dbh->prepare($cmd);
        $params = [$userId];
        $stmt->execute($params);
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
        $cmd = "SELECT user_id, email, username FROM {$this->table} WHERE email = ? LIMIT 1";
        $stmt = $this->dbh->prepare($cmd);
        $params = [$email];
        $stmt->execute($params);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
    * Updates the password hash for a given user ID.
    *
    * @param int    $userId The ID of the user to update.
    * @param string $newPasswordHash The new, already hashed password.
    * @return bool True if the query executed successfully, false otherwise.
    */
    public function updatePassword(int $userId, string $newPasswordHash): bool
    {
        $cmd = "UPDATE {$this->table} SET password_hash = ? WHERE user_id = ?";
        $stmt = $this->dbh->prepare($cmd);
        $params = [$newPasswordHash, $userId];
        return $stmt->execute($params);
    }
}