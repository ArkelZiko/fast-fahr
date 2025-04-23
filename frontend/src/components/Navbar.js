/**
 * File:         NavBar.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 19th, 2025
 * Description:  Component rendering the main navigation bar with links
 *               to different sections of the application (Home, Buying, Selling, etc.).
*/

import React from "react";
import "./css/navbar.css";
import { Link } from "react-router-dom";

/**
 * Renders the main site navigation bar.
 * Uses React Router's Link component for client-side navigation.
 * @returns {JSX.Element} The navigation bar component.
*/
function NavBar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/buying">Buying</Link>
        </li>
        <li>
          <Link to="/selling">Selling</Link>
        </li>
        <li>
          <Link to="/bookmarks">Bookmarks</Link>
        </li>
        <li>
          <Link to="/messages">Messages</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
