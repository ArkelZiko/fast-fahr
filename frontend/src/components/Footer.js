/**
 * File:         Footer.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 19th, 2025
 * Description:  Component rendering the website footer, including logo,
 *               social media links, additional text/links, and copyright info.
 */

import React from "react";
import "./css/footer.css";
import logo from "./images/logo.png";

/**
 * Renders the site footer.
 * @returns {JSX.Element} The footer component.
*/
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
          <p className="follow-text">Contact Us</p>
          <div className="social-icons">
          <a
              href="mailto:fast.fahr.help@gmail.com/"
              target="_blank"
              
            >
              <i className="fas fa-envelope"></i>
          </a>

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
