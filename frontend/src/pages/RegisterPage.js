/**
 * File:         RegisterPage.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 20th, 2025
 * Description:  Page component for user registration. Provides a form for username,
 *               email, and password. Handles form submission, calls the registration
 *               API endpoint, displays success/error messages, and navigates to
 *               the login page upon successful registration.
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../components/loginElements/LoginHeader';
import '../components/css/register.css';

/**
 * Renders the user registration page.
 * @returns {JSX.Element} The RegisterPage component.
*/
function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  });

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true, info: { error: false, msg: null } }));

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch(`${process.env.REACT_APP_API_BASE}/auth/register.php`, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok && data.success) { 
        setFormData({ username: '', email: '', password: '' });
        setStatus({
          submitted: true,
          submitting: false,
          info: { error: false, msg: data.message || 'Registration successful!' }
        });

        setTimeout(() => {
          navigate('/login');
        }, 3000);

      } else {
        throw new Error(data.message || `Registration failed with status: ${response.status}`);
      }

    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: error.message || 'An unexpected error occurred.' }
      });
    }
  };

  return (
    <div className="login-page">
      <LoginHeader />
      <div className="form-container">
        <h2>Registration Form</h2>

        {status.info.error && (
          <div className="error-message">
            Error: {status.info.msg}
          </div>
        )}

        {status.submitted && !status.info.error && (
          <div className="success-message">
            {status.info.msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            style={{ width: "100%" }} 
            type="submit" 
            disabled={status.submitting}
          >
            {status.submitting ? 'Submitting...' : 'Submit'}
          </button>

          <div className="form-footer">
            <a href="/fastfahr/">Homepage</a>
            <span className="separator">•</span>
            <a href="/fastfahr/forgot-password">Forgot password?</a>
            <span className="separator">•</span>
            <a href="/fastfahr/login">Return to Login</a>
         </div>

        </form>
      </div>
    </div>
  );
}

export default RegisterPage;