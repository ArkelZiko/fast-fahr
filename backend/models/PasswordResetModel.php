<?php

/**
 * File:         PasswordResetModel.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 4th, 2025
 * Description:  Model class for handling database operations related to password
 *               reset tokens (creating, validating, deleting).
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
        if ($dbConnection === null) {
            throw new InvalidArgumentException("Database connection cannot be null.");
        }
        $this->dbh = $dbConnection;
    }

    /**
     * Creates a new password reset token entry, returning the plain token.
     *
     * @param int    $userId The ID of the user requesting the reset.
     * @param string $email The email of the user.
     * @return string|false The plain reset token if successful, false on failure.
     */
    public function createResetToken(int $userId, string $email): string|false
    {
        try {
            $sql_delete = "DELETE FROM {$this->table} WHERE user_id = :user_id";
            $stmt_delete = $this->dbh->prepare($sql_delete);
            $params_delete = [':user_id' => $userId];

            $plainToken = bin2hex(random_bytes(32));
            $hashedToken = password_hash($plainToken, PASSWORD_DEFAULT);
            $expires = new DateTime('+1 hour');
            $expiresFormatted = $expires->format('Y-m-d H:i:s');

            $sql_insert = "INSERT INTO {$this->table} (user_id, email, token, expires_at) VALUES (:user_id, :email, :token, :expires_at)";
            $stmt_insert = $this->dbh->prepare($sql_insert);
            $params_insert = [
                ':user_id' => $userId,
                ':email' => $email,
                ':token' => $hashedToken,
                ':expires_at' => $expiresFormatted
            ];
            $execute_insert = $stmt_insert->execute($params_insert);

            if ($execute_insert) {
                return $plainToken;
            } else {
                error_log("Failed to execute password reset token creation for user ID: " . $userId);
                return false;
            }
        } catch (PDOException $e) {
            error_log("Database error in createResetToken: " . $e->getMessage());
            return false;
        } catch (Exception $e) {
            error_log("Error generating token in createResetToken: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Validates a plain token against the stored hashed token for an email.
     *
     * @param string $email The user's email.
     * @param string $plainToken The plain token received from the user.
     * @return array|false The reset request data array (incl. user_id, id) if valid, false otherwise.
     */
    public function validateResetToken(string $email, string $plainToken): array|false
    {
        try {
            $currentTime = date('Y-m-d H:i:s');

            $sql = "SELECT * FROM {$this->table}
                    WHERE email = :email AND expires_at > :current_time
                    ORDER BY created_at DESC LIMIT 1";
            $stmt = $this->dbh->prepare($sql);
            $params = [
                ':email' => $email,
                ':current_time' => $currentTime
            ];
            $execute = $stmt->execute($params);

            if ($execute) {
                $requestData = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($requestData && password_verify($plainToken, $requestData['token'])) {
                    return $requestData;
                }
            } else {
                error_log("Failed to execute token validation query for email: " . $email);
            }
            return false;
        } catch (PDOException $e) {
            error_log("Database error in validateResetToken: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Deletes a specific password reset token by its primary key ID.
     *
     * @param int $resetId The ID of the password_resets record.
     * @return bool True on success, false on failure.
     */
    public function deleteTokenById(int $resetId): bool
    {
        try {
            $sql = "DELETE FROM {$this->table} WHERE id = :id";
            $stmt = $this->dbh->prepare($sql);
            $params = [':id' => $resetId];
            $execute = $stmt->execute($params);
            return $execute;
        } catch (PDOException $e) {
            error_log("Database error in deleteTokenById for ID $resetId: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Deletes all password reset tokens for a specific user ID.
     *
     * @param int $userId The user's ID.
     * @return bool True on success or if no tokens existed, false on DB error.
     */
    public function deleteTokensForUser(int $userId): bool
    {
        try {
            $sql = "DELETE FROM {$this->table} WHERE user_id = :user_id";
            $stmt = $this->dbh->prepare($sql);
            $params = [':user_id' => $userId];
            $execute = $stmt->execute($params);
            return $execute;
        } catch (PDOException $e) {
            error_log("Database error in deleteTokensForUser for user ID $userId: " . $e->getMessage());
            return false;
        }
    }
}
