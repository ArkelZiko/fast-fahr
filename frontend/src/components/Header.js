import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProfileMenu from './ProfileMenu'; // Adjust path as needed
import "./css/header.css";
import "./css/profile-menu.css"; // Make sure the CSS path is correct
import logo from "./images/logo.png";

/**
 * Renders the main site header, adapting based on user login status.
 * @returns {JSX.Element} The header component.
*/
function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Debug the current user data
  useEffect(() => {
    if (currentUser) {
      console.log("Current user in Header:", currentUser);
      console.log("Profile picture property:", currentUser.profile_picture);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/auth/logout.php`, {
          method: 'POST',
          credentials: 'include'
      });

      const data = await response.json();
      
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
       logout();
       navigate('/login');
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

      {/* Conditionally render Sign-in or Profile Menu */}
      <div className="header-actions">
        {currentUser ? (
          <ProfileMenu 
            user={currentUser} 
            onLogout={handleLogout} 
          />
        ) : (
          <button onClick={handleSignInClick} className="sign-in-btn">Sign-in</button>
        )}
      </div>
    </header>
  );
}

export default Header;