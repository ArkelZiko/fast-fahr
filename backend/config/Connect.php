<?php

// CONNECT TO DATABASE, use  include 'connect.php';   in other backend filess that need database connection

try {
    $dbh = new PDO(
        "mysql:host=localhost;dbname=zikoa_db",
        "root",
        ""
    );

    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("ERROR: Couldn't connect. {$e->getMessage()}");
}
?>