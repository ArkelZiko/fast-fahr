import React from "react";
import "./css/navbar.css";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/buy">Buying</Link>
        </li>
        <li>
          <Link to="/sell">Selling</Link>
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
