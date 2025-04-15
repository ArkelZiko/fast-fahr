import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginHeader from '../components/loginElements/LoginHeader';
import '../components/css/login.css';

function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
    const [status, setStatus] = useState({ submitting: false, info: { error: false, msg: null } });
    const [tokenData, setTokenData] = useState({ email: '', token: '' });

    useEffect(() => {
        if (location.state?.email && location.state?.token) {
            setTokenData({ email: location.state.email, token: location.state.token });
        } else {
            setStatus({ submitting: false, info: { error: true, msg: 'Invalid session or token missing. Please start over.' } });
            setTimeout(() => navigate('/forgot-password', { replace: true }), 3000);
        }
    }, [location.state, navigate]);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
        setStatus(prev => ({ ...prev, info: { error: false, msg: null } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tokenData.email || !tokenData.token) return;

        if (passwords.password !== passwords.confirmPassword) {
            setStatus({ submitting: false, info: { error: true, msg: 'Passwords do not match.' } });
            return;
        }
        if (passwords.password.length < 8) {
             setStatus({ submitting: false, info: { error: true, msg: 'Password must be at least 8 characters.' } });
             return;
        }

        setStatus({ submitting: true, info: { error: false, msg: null } });

        try {
            const formData = new FormData();
            formData.append('email', tokenData.email);
            formData.append('token', tokenData.token);
            formData.append('password', passwords.password);

            const response = await fetch(`${process.env.REACT_APP_API_BASE}/auth/reset_password.php`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || `Password reset failed with status: ${response.status}`);
            }

            setStatus({ submitting: false, info: { error: false, msg: data.message } });
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 3000);

        } catch (error) {
             setStatus({ submitting: false, info: { error: true, msg: error.message || 'Failed to reset password. The token might have expired or been used.' } });
        }
    };

    const canSubmit = !status.submitting && !!tokenData.email && !!tokenData.token && !(status.info.msg && !status.info.error);

    return (
        <div className="login-page">
            <LoginHeader />
            <div className="login-container">
                <h2>Set New Password</h2>

                {status.info.msg && (
                    <div className={status.info.error ? "error-message" : "success-message"}>
                        {status.info.msg}
                    </div>
                )}

                {tokenData.email && tokenData.token && !(status.info.msg && !status.info.error) && (
                    <form onSubmit={handleSubmit}>
                        <p>Enter and confirm your new password for <strong>{tokenData.email}</strong>.</p>
                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={passwords.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter new password (min 8 chars)"
                                disabled={!canSubmit}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your new password"
                                disabled={!canSubmit}
                            />
                        </div>
                        <button type="submit" disabled={!canSubmit} className="login-button">
                            {status.submitting ? 'Resetting...' : 'Set New Password'}
                        </button>
                    </form>
                )}

                <div className="form-footer">
                    <a href="/fastfahr/">Homepage</a>
                    <span className="separator">•</span>
                    <a href="/fastfahr/login">Return to Login</a>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;