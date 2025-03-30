import React from "react";
import "./css/header.css";
import logo from "./images/logo.png";

function Header() {
  return (
    <header className="header">
      <div className="logo-and-title">
        <img src={logo} alt="Logo" className="logo-img" />
        <h1 className="site-name">FastFahr</h1>
      </div>

      <div className="search-wrapper">
        <input type="text" className="search-box" placeholder="Search" />
        <button className="filter-btn">
          <i className="fas fa-filter"></i>
        </button>
      </div>

      <button className="sign-in-btn">Sign-in</button>
    </header>
  );
}

export default Header;
