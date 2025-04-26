import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProfileMenu from "./ProfileMenu";
import "./css/header.css";
import "./css/profile-menu.css";
import logo from "./images/logo.png";

/**
 * Renders the main site header, adapting based on user login status.
 * @returns {JSX.Element} The header component.
 */

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");

  // Debug the current user data
  useEffect(() => {
    if (currentUser) {
      console.log("Current user in Header:", currentUser);
      console.log("Profile picture property:", currentUser.profile_picture);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/auth/logout.php`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      await response.json();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  const handleSignInClick = () => {
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const raw = search.trim();

    if (raw.length === 0) {
      setSearchError("Please enter a search term.");
      return;
    }
    if (raw.length > 100) {
      setSearchError("Search term too long. Max 100 characters.");
      return;
    }
    setSearchError("");
    const cleaned = raw.replace(/[\s-]/g, "").toLowerCase();

    navigate(`/buying?search=${encodeURIComponent(cleaned)}`);
  };

  return (
    <header className="header">
      <div className="logo-and-title">
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            gap: "1rem",
          }}
        >
          <img src={logo} alt="Logo" className="logo-img" />
          <h1 className="site-name">FastFahr</h1>
        </Link>
      </div>

      <form className="search-wrapper" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-box"
          placeholder="Search for Vehicles"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="search-btn" title="Search">
          <i className="fas fa-search"></i>
        </button>
      </form>

      {/* Conditionally render Sign-in or Profile Menu */}
      <div className="header-actions">
        {currentUser ? (
          <ProfileMenu user={currentUser} onLogout={handleLogout} />
        ) : (
          <button onClick={handleSignInClick} className="sign-in-btn">
            Sign-in
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
