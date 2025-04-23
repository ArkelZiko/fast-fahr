/**
 * File:         ResetCodePage.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 6th, 2025
 * Description:  Page component for verifying the password reset code sent via email.
 *               Receives email via navigation state, collects the code from the user,
 *               calls the verify_code API endpoint, displays feedback, and navigates
 *               to the password setting page on success.
*/

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginHeader from '../components/loginElements/LoginHeader';
import '../components/css/login.css';


/**
 * Renders the page for verifying a password reset code.
 * @returns {JSX.Element} The ResetCodePage component.
*/
function ResetCodePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [code, setCode] = useState('');
    const [status, setStatus] = useState({ submitting: false, info: { error: false, msg: null } });
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
            setStatus(prev => ({ ...prev, info: { ...prev.info, msg: `Enter code sent to ${location.state.email}` } }));
        } else {
            setStatus({ submitting: false, info: { error: true, msg: 'Invalid access. Please start the password reset process again.' } });
            setTimeout(() => navigate('/forgot-password', { replace: true }), 3000);
        }
    }, [location.state, navigate]);

    const handleChange = (e) => {
        setCode(e.target.value);
         setStatus(prev => ({ ...prev, submitting: false, info: { ...prev.info, error: false, msg: prev.info.error ? null : prev.info.msg } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus({ submitting: true, info: { error: false, msg: null } });

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('token', code);

            const response = await fetch(`${process.env.REACT_APP_API_BASE}/auth/verify_code.php`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || `Verification failed with status: ${response.status}`);
            }

            setStatus({ submitting: false, info: { error: false, msg: 'Code verified! Proceed to set new password.' } });
            setTimeout(() => {
                navigate('/reset-password', { state: { email: email, token: code } });
            }, 1500);

        } catch (error) {
            setStatus({ submitting: false, info: { error: true, msg: error.message || 'Invalid or expired code.' } });
        }
    };

    return (
        <div className="login-page">
            <LoginHeader />
            <div className="login-container">
                <h2>Enter Reset Code</h2>
                <p>If no reset code can be found, check your spam folder or request a new code.</p>
                 {status.info.msg && (
                    <div className={status.info.error ? "error-message" : "success-message"}>
                        {status.info.msg}
                    </div>
                )}
                {email && !status.info.error && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="code">Reset Code</label>
                            <input
                                id="code"
                                type="text"
                                name="code"
                                value={code}
                                onChange={handleChange}
                                required
                                placeholder="Enter the code from your email"
                                disabled={status.submitting || !email}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status.submitting || !email || !code}
                            className="login-button"
                        >
                            {status.submitting ? 'Verifying...' : 'Verify Code'}
                        </button>
                    </form>
                )}

                <div className="form-footer">
                    <a href="/fastfahr/">Homepage</a>
                    <span className="separator">•</span>
                    <a href="/fastfahr/forgot-password">Request new code</a>
                    <span className="separator">•</span>
                    <a href="/fastfahr/login">Return to Login</a>
                </div>
            </div>
        </div>
    );
}

export default ResetCodePage;