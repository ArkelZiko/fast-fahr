<!-- <?php
// models/User.php
// class User {
//     private $dbh;
//     private $table = 'users';

//     public function __construct($dbConnection) {
//         $this->dbh = $dbConnection;
//     }

//     
//     public function getUserById($id) {
//         $stmt = $this->dbh->prepare("SELECT * FROM {$this->table} WHERE id = :id");
//         $stmt->execute(['id' => $id]);
//         return $stmt->fetch(PDO::FETCH_ASSOC);
//     }

//     
//     public function createUser($name, $email) {
//         $stmt = $this->dbh->prepare("INSERT INTO {$this->table} (name, email) VALUES (:name, :email)");
//         return $stmt->execute(['name' => $name, 'email' => $email]);
//     }

//     
//     public function updateUser($id, $name, $email) {
//         $stmt = $this->dbh->prepare("UPDATE {$this->table} SET name = :name, email = :email WHERE id = :id");
//         return $stmt->execute(['id' => $id, 'name' => $name, 'email' => $email]);
//     }
// }
?> -->