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
}
?>