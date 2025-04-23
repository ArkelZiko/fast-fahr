/**
 * File:         ForgotPasswordPage.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 5th, 2025
 * Description:  Page component allowing users to request a password reset email.
 *               Collects the user's email and sends it to the request_reset API endpoint.
 *               Provides feedback on success or failure and navigates to the code verification page on success.
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../components/loginElements/LoginHeader';
import '../components/css/login.css';


/**
 * Renders the Forgot Password page form.
 * @returns {JSX.Element} The ForgotPasswordPage component.
*/
function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ submitting: false, info: { error: false, msg: null } });

    const handleChange = (e) => {
        setEmail(e.target.value);
        setStatus({ submitting: false, info: { error: false, msg: null } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ submitting: true, info: { error: false, msg: null } });

        try {
            const formData = new FormData();
            formData.append('email', email);

            const response = await fetch(`${process.env.REACT_APP_API_BASE}/auth/request_reset.php`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || `Request failed with status: ${response.status}`);
            }

            setStatus({ submitting: false, info: { error: false, msg: data.message } });
            setTimeout(() => {
                navigate('/verify-code', { state: { email: email } });
            }, 3000);

        } catch (error) {
            setStatus({ submitting: false, info: { error: true, msg: error.message || 'An unexpected error occurred.' } });
        }
    };

    return (
        <div className="login-page">
            <LoginHeader />
            <div className="login-container">
                <h2>Forgot Password</h2>

                {status.info.msg && (
                    <div className={status.info.error ? "error-message" : "success-message"}>
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
                            value={email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your registered email"
                            disabled={status.submitting || (status.info.msg && !status.info.error)}
                        />
                    </div>
                    <button type="submit" disabled={status.submitting || (status.info.msg && !status.info.error)} className="login-button">
                        {status.submitting ? 'Sending...' : 'Send Reset Instructions'}
                    </button>
                </form>

                <div className="form-footer">
                    <a href="/fastfahr/">Homepage</a>
                    <span className="separator">•</span>
                    <a href="/fastfahr/login">Return to Login</a>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;