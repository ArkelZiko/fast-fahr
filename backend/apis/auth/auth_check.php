<?php

/**
 * File:         auth_check.php
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 22nd, 2025
 * Description:  Reusable function included in other API endpoints to verify if a
 *               user is currently logged in based on session variables. If not
 *               logged in, it sends a 401 Unauthorized response and exits.
 *               Returns the user ID if logged in.
 */

/**
 * Checks if a user is logged in via session variables.
 * If the user is not logged in, it sends a 401 HTTP response with a JSON error
 * message and terminates the script execution.
 * If the user is logged in, it returns the user's ID from the session.
 * Ensures a session is started if one isn't already active.
 *
 * @return int The user ID of the logged-in user.
 * @throws void Exits script if user is not logged in.
*/
function require_login() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true || !isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required. Please log in.']);
        exit;
    }
    
     return $_SESSION['user_id'];
}
?>