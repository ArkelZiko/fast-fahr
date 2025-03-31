import React from "react";
import "../css/header.css";
import logo from "../images/logo.png";

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
