/**
 * File:         App.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 19th, 2025
 * Description:  Main application component. Sets up routing using React Router
 *               and wraps the application with the AuthProvider for authentication context.
 *               Defines all the main page routes for the application.
 */

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import BuyingPage from "./pages/BuyingPage";
import HomePage from "./pages/HomePage";
import MessagesPage from "./pages/MessagesPage";
import SellingPage from "./pages/SellingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetCodePage from "./pages/ResetCodePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import BookmarksPage from "./pages/BookmarksPage";
import ManageAccount from "./pages/ManageAccount";

/**
 * The root component of the FastFahr application.
 * Initializes the router, authentication context, and defines routes for all pages.
 * @returns {JSX.Element} The main application structure with routing.
 */
function App() {
  return (
    <Router basename="/fastfahr">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/buying" element={<BuyingPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/selling" element={<SellingPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-code" element={<ResetCodePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/account" element={<ManageAccount />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
