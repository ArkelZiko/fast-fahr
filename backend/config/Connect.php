<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;


// CONNECT TO DATABASE, use  include 'connect.php';   in other backend filess that need database connection

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();
var_dump($_ENV); //quick lil vardump never hurt
exit;


try {
    $dbh = new PDO(
        "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']}",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS']
    );

    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("ERROR: Couldn't connect. {$e->getMessage()}");
}