import React, { useState } from 'react';
import LoginHeader from '../components/loginElements/LoginHeader';
import '../components/css/register.css';

function LoginPage() {
  // State to store form data
  const [formData, setFormData] = useState({
    username: '',
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
    setFormData({
      ...formData,
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
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Send form data to PHP file
      
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/auth/login.php`, {

        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({ username: '', email: '', password: '' });
        setStatus({
          submitted: true,
          submitting: false,
          info: { error: false, msg: data.message }
        });
        
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
            <a href="/fastfahr/login">Return to Login</a>
         </div>

        </form>
      </div>
    </div>
  );
}

export default LoginPage;