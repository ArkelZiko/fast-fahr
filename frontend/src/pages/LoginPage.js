import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import { useAuth } from '../hooks/useAuth'; // Import the auth hook
import LoginHeader from '../components/loginElements/LoginHeader';
import '../components/css/login.css';

function LoginPage() {
  const navigate = useNavigate(); // Hook for navigation
  const { login } = useAuth(); // Get the login function from context

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  });

  const handleChange = e => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setStatus(prev => ({ ...prev, info: { error: false, msg: null } })); // Clear error on change
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true, info: { error: false, msg: null } }));

    try {
      const formDataToSend = new FormData();
      Object.keys(loginData).forEach(key => {
        formDataToSend.append(key, loginData[key]);
      });

      // --- IMPORTANT: Update API URL if needed ---
      const response = await fetch('http://localhost/fastfahr/backend/apis/auth/login.php', { // Adjusted path
        method: 'POST',
        body: formDataToSend,
        // --- IMPORTANT: No 'credentials: include' needed for FormData POST usually ---
        // Browsers handle cookies automatically for same-origin requests,
        // but CORS headers on PHP side are still needed if origins differ (like localhost:3000 vs localhost)
      });

      const data = await response.json();

      if (!response.ok) {
        // Throw error using message from backend response
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Backend response indicates success
      if (data.success && data.user) {
        setStatus({
          submitted: true,
          submitting: false,
          info: { error: false, msg: data.message }
        });

        // --- Use Auth Context ---
        login(data.user); // Update global auth state

        // --- Use React Router Navigation ---
        navigate('/', { replace: true }); // Redirect to home page, replace login in history

      } else {
         // Handle cases where backend might send success: false even with 200 OK
         throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

    } catch (error) {
      console.error("Login error:", error); // Log the error for debugging
      setStatus({
        submitted: false, // Keep submitted false on error
        submitting: false,
        info: { error: true, msg: error.message || 'An unexpected error occurred.' }
      });
    }
  };

  return (
    <div className="login-page">
      <LoginHeader />
      <div className="login-container">
        <h2>Login</h2>

        {/* Show error message */}
        {status.info.error && (
          <div className="error-message">
            {status.info.msg}
          </div>
        )}

        {status.submitted && !status.info.error && (
          <div className="success-message">
            {status.info.msg}
          </div>
        )}  {/* Maybe delete this block here */}

        <form onSubmit={handleSubmit}>
          {/* Form groups remain the same */}
           <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email" type="email" name="email"
              value={loginData.email} onChange={handleChange} required
              placeholder="Enter your email" disabled={status.submitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password" type="password" name="password"
              value={loginData.password} onChange={handleChange} required
              placeholder="Enter your password" disabled={status.submitting}
            />
          </div>
          <button type="submit" disabled={status.submitting} className="login-button">
            {status.submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer remains the same */}
        <div className="form-footer">
            <a href="/fastfahr/">Homepage</a>
            <span className="separator">•</span>
            <a href="/fastfahr/forgot-password">Forgot password?</a>
            <span className="separator">•</span>
           <a href="/fastfahr/register">Create account</a>
         </div>
      </div>
    </div>
  );
}

export default LoginPage;