import React from "react";
import "./css/navbar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <a href="#home">Buy</a>
        </li>
        <li>
          <a href="#browse">Sell</a>
        </li>
        <li>
          <a href="#offers">Messages</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
