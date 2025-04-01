import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import { useAuth } from "../hooks/useAuth"; // Import the auth hook
import "./css/header.css";
import logo from "./images/logo.png";

function Header() {
  const { currentUser, logout } = useAuth(); // Get user state and logout function
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      const response = await fetch('http://localhost/fastfahr/backend/apis/auth/logout.php', {
          method: 'POST',
          credentials: 'include' // Important to send session cookies
      });
      const data = await response.json();
      console.log("Logout API response:", data);
      if (!response.ok || !data.success) {
           console.warn("Backend logout failed or session was already invalid:", data.message);
      }
    } catch (error) {
      console.error("Error calling logout API:", error);
    } finally {
       logout();
    }
  };

  const handleSignInClick = () => {
    // Navigate to the login page (adjust path if your base path isn't handled by Router)
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
        <button className="filter-btn" title="Filter">
          <i className="fas fa-filter"></i>
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