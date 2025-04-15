import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import BuyingPage from "./pages/BuyingPage";
import HomePage from "./pages/HomePage";
import MessagesPage from "./pages/MessagesPage";
import SellingPage from "./pages/SellingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetCodePage from './pages/ResetCodePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import BookmarksPage from "./pages/BookmarksPage";

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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;