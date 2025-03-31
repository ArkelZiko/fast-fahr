import React from "react";
import "./css/footer.css"; // Correct path to the footer CSS
import logo from "./images/logo.png"; // Logo Image

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section - Logo */}
        <div className="footer-left">
          <img src={logo} alt="Fast-Fahr Logo" className="footer-logo" />
        </div>

        {/* Center Section - Social Links */}
        <div className="footer-center">
          <p className="follow-text">Follow Us</p>
          <div className="social-icons">
            <a
              href="https://twitter.com/"
              target="_blank"
              
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className="footer-right">
          <p className="footer-text">
            Find the perfect car for you <br />
            <a
              href="https://www.iseecars.com/german-cars"
              target="_blank"
            //   
              className="learn-more"
            >
              Learn More
            </a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Fast-Fahr. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
