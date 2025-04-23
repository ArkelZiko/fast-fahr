/**
 * File:         LoginHeader.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 20th, 2025
 * Description:  A simplified header component specifically for use on login,
 *               registration, and password reset pages. Displays only the logo
 *               and site name, without search or user actions.
*/

import React from "react";
import "../css/header.css";
import logo from "../images/logo.png";

/**
 * Renders a minimal header containing only the logo and site name.
 * Typically used for authentication-related pages.
 * @returns {JSX.Element} The LoginHeader component.
*/
function LoginHeader() {
  return (
    <header className="header">
      <div className="logo-and-title">
        <img src={logo} alt="Logo" className="logo-img" />
        <h1 className="site-name">FastFahr</h1>
      </div>
    </header>
  );
}

export default LoginHeader;
