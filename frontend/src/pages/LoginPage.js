import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/css/login.css';
import LoginHeader from '../components/loginElements/LoginHeader';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
    setStatus(prev => ({ ...prev, info: { error: false, msg: null } }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true, info: { error: false, msg: null } }));
    
    try {
      const formDataToSend = new FormData();
      Object.keys(loginData).forEach(key => {
        formDataToSend.append(key, loginData[key]);
      });

      const response = await fetch(`${process.env.REACT_APP_API_BASE}/auth/login.php`, {

        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success && data.user) {
        setStatus({
          submitted: true,
          submitting: false,
          info: { error: false, msg: data.message }
        });

        login(data.user);

        navigate('/', { replace: true });

      } else {
         throw new Error(data.message || 'Login failed. Please check your credentials.');
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
      <div className="login-container">
        <h2>Login</h2>

        {/* show error message */}
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