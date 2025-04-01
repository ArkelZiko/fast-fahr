import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check session on initial load
        fetch('http://localhost/fastfahr/backend/services/check_session.php', { credentials: 'include' }) // Important for sending session cookies
            .then(res => res.json())
            .then(data => {
                if (data.isLoggedIn && data.user) {
                    setCurrentUser(data.user);
                } else {
                    setCurrentUser(null);
                }
            })
            .catch(error => {
                console.error("Session check failed:", error);
                setCurrentUser(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const login = (userData) => {
        setCurrentUser(userData);
        // Store maybe? localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        // TODO: Call a /api/auth/logout.php endpoint if you have one
        setCurrentUser(null);
        // localStorage.removeItem('user');
        navigate('/login'); // Redirect after logout
    };

     // Function to check auth and redirect if necessary
    const requireAuth = () => {
        if (!isLoading && !currentUser) {
            console.log("Authentication required, redirecting...");
            navigate('/login', { replace: true }); // Use replace to avoid back button to protected page
            return false; // Indicate auth failed
        }
        return true; // Indicate auth passed
    };


    const value = { currentUser, isLoading, login, logout, requireAuth };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};