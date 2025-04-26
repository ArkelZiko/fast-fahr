<?php

/**
 * File:         check_session.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 19th, 2025
 * Description:  Main config file for establishing a db connection w/ PDO
 */

try {
    $dbh = new PDO(
        "mysql:host=localhost;dbname=fastfahr",
        "root",
        ""
    );
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("ERROR: Couldn't connect. {$e->getMessage()}");
}
