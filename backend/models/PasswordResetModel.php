<?php

/**
 * File:         PasswordResetModel.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 4th, 2025
 * Description:  Model class for handling database operations related to password
 *               reset tokens using positional placeholders. Error handling removed.
 */

class PasswordReset
{
    private $dbh;
    private $table = 'password_resets';

    /**
    * Constructor for PasswordReset model.
    *
    * @param PDO $dbConnection A PDO database connection object.
    * @throws InvalidArgumentException If the database connection is null.
    */
    public function __construct($dbConnection)
    {
        $this->dbh = $dbConnection;
    }

    /**
    * Creates a new password reset token entry, returning the plain token.
    * Deletes any existing tokens for the user first. Assumes operations succeed.
    *
    * @param int    $userId The ID of the user requesting the reset.
    * @param string $email The email of the user.
    * @return string|false The plain reset token if insertion was successful, false otherwise.
    */
    public function createResetToken(int $userId, string $email): string|false
    {
        $cmd_delete = "DELETE FROM {$this->table} WHERE user_id = ?";
        $stmt_delete = $this->dbh->prepare($cmd_delete);
        $params_delete = [$userId];
        $stmt_delete->execute($params_delete);

        $plainToken = bin2hex(random_bytes(32));
        $hashedToken = password_hash($plainToken, PASSWORD_DEFAULT);
        $expires = new DateTimeImmutable('+1 hour');
        $expiresFormatted = $expires->format('Y-m-d H:i:s');

        $cmd_insert = "INSERT INTO {$this->table} (user_id, email, token, expires_at) VALUES (?, ?, ?, ?)";
        $stmt_insert = $this->dbh->prepare($cmd_insert);
        $params_insert = [
            $userId,
            $email,
            $hashedToken,
            $expiresFormatted
        ];
        $success_insert = $stmt_insert->execute($params_insert);

        return $success_insert ? $plainToken : false;
    }

    /**
    * Validates a plain token against the stored hashed token for an email.
    * Assumes query succeeds.
    *
    * @param string $email The user's email.
    * @param string $plainToken The plain token received from the user.
    * @return array|false The reset request data array if valid, false otherwise.
    */
    public function validateResetToken(string $email, string $plainToken): array|false
    {
        $currentTime = date('Y-m-d H:i:s');

        $cmd = "SELECT * FROM {$this->table}
                WHERE email = ? AND expires_at > ?
                ORDER BY created_at DESC LIMIT 1";
        $stmt = $this->dbh->prepare($cmd);
        $params = [$email, $currentTime];
        $stmt->execute($params);

        $requestData = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($requestData && password_verify($plainToken, $requestData['token'])) {
            return $requestData;
        }

        return false;
    }

    /**
    * Deletes a specific password reset token by its primary key ID.
    * Assumes query executes.
    *
    * @param int $resetId The ID of the password_resets record.
    * @return bool The result of the execute call (true on success, false on failure).
    */
    public function deleteTokenById(int $resetId): bool
    {
        $cmd = "DELETE FROM {$this->table} WHERE id = ?";
        $stmt = $this->dbh->prepare($cmd);
        $params = [$resetId];
        return $stmt->execute($params);
    }

    /**
    * Deletes all password reset tokens for a specific user ID.
    * Assumes query executes.
    *
    * @param int $userId The user's ID.
    * @return bool The result of the execute call (true on success, false on failure).
    */
    public function deleteTokensForUser(int $userId): bool
    {
        $cmd = "DELETE FROM {$this->table} WHERE user_id = ?";
        $stmt = $this->dbh->prepare($cmd);
        $params = [$userId];
        return $stmt->execute($params);
    }
}