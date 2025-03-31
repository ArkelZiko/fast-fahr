import React from "react";
import "../css/login.css";

function signInElements() {
  return (
    <div className="login-elements">
      <h1 className="loginMessage">Login to your Account</h1>
      <input name="email" />
    </div>
  );
}

export default signInElements;
