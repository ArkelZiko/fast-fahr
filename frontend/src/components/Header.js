/**
 * File:         Header.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 19th, 2025
 * Description:  Component rendering the main site header. Includes the logo/site name,
 *               a search bar (currently non-functional), and conditional rendering
 *               for either a "Sign-in" button or user greeting/logout button
 *               based on the authentication status from useAuth hook.
*/

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./css/header.css";
import logo from "./images/logo.png";


/**
 * Renders the main site header, adapting based on user login status.
 * @returns {JSX.Element} The header component.
*/
function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/auth/logout.php`, {

          method: 'POST',
          credentials: 'include'
      });

      const data = await response.json();
      
    } catch (error) {
      
    } finally {
       logout();
    }
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo-and-title">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '1rem' }}>
          <img src={logo} alt="Logo" className="logo-img" />
          <h1 className="site-name">FastFahr</h1>
        </Link>
      </div>

      <div className="search-wrapper">
        <input type="text" className="search-box" placeholder="Search" />
        <button className="search-btn" title="Search">
          <i className="fas fa-search"></i>
        </button>
      </div>

      {/* Conditionally render Sign-in or User info/Logout */}
      <div className="header-actions">
        {currentUser ? (
          <div className="header-user-info">
            {/* You can add more user info here if needed */}
            {/* <img src={currentUser.profile_picture || 'default-avatar.png'} alt="Avatar" className="header-avatar"/> */}
            <span className="header-username">Hi, {currentUser.username}!</span>
            <button onClick={handleLogout} className="sign-in-btn logout-btn">Logout</button>
          </div>
        ) : (
          <button onClick={handleSignInClick} className="sign-in-btn">Sign-in</button>
        )}
      </div>
    </header>
  );
}

export default Header;