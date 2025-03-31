import React, { useState } from 'react';
import LoginHeader from '../components/loginElements/LoginHeader';
import '../components/css/login.css';

function LoginPage() {
  // State to store login credentials
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // State for form submission status
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  });

  // Handle input changes
  const handleChange = e => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));

    try {
      // Create form data object to send to PHP
      const formDataToSend = new FormData();
      Object.keys(loginData).forEach(key => {
        formDataToSend.append(key, loginData[key]);
      });

      // Send login data to PHP file
      const response = await fetch('http://localhost/fastfahr/backend/apis/login.php', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          submitted: true,
          submitting: false,
          info: { error: false, msg: data.message }
        });

        // If login is successful, complete a redirect
        if (data.success) {
          // Store auth info in localStorage or sessionStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(data.user));

          // Redirect to dashboard or home page
          window.location.href = '/fastfahr';
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: error.message }
      });
    }
  };

  return (
    <div className="login-page">
      <LoginHeader />
      <div className="login-container">
        <h2>Login</h2>

        {status.info.error && (
          <div className="error-message">
            {status.info.msg}
          </div>
        )}

        {status.submitted && !status.info.error && (
          <div className="success-message">
            {status.info.msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={status.submitting}
            className="login-button"
          >
            {status.submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="form-footer">
          <a href="/fastfahr/forgot-password">Forgot password?</a>
          <span className="separator">•</span>
          <a href="/fastfahr/register">Create an account</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;