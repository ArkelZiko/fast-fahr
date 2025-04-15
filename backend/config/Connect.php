<?php

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