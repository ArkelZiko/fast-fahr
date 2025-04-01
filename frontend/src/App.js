import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth"; // Import the provider

import BuyingPage from "./pages/BuyingPage";
import HomePage from "./pages/HomePage";
import MessagesPage from "./pages/MessagesPage";
import SellingPage from "./pages/SellingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookmarksPage from "./pages/BookmarksPage";

function App() {
  return (
    // --- Router needs to be the outermost component ---
    <Router basename="/fastfahr">
      {/* AuthProvider goes INSIDE Router */}
      <AuthProvider>
        {/* Routes component handles route matching */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/buying" element={<BuyingPage />} />

          {/* Protected Routes (will be checked by components using useAuth) */}
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/selling" element={<SellingPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />

          {/* Add other routes here */}

          {/* Optional: Catch-all route for 404 */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;