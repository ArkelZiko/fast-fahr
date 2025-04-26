/**
 * File:         useAuth.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 25th, 2025
 * Description:  Provides an authentication context and hook (`useAuth`) for managing
 *               user authentication state (currentUser, isLoading) throughout the application.
 *               Includes functions for login, logout, and requiring authentication for routes.
 */

import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/auth/check_session.php`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isLoggedIn && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch((error) => {
        setCurrentUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  const requireAuth = () => {
    if (!isLoading && !currentUser) {
      navigate("/login", { replace: true });
      return false;
    }
    return true;
  };

  const value = { currentUser, isLoading, login, logout, requireAuth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
