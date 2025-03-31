import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BuyingPage from "./pages/BuyingPage";
import HomePage from "./pages/HomePage";
import MessagesPage from "./pages/MessagesPage";
import SellingPage from "./pages/SellingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Router basename="/fastfahr">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/selling" element={<SellingPage />} />
        <Route path="/buying" element={<BuyingPage />} />
        <Route path="/login" element={< LoginPage/>} />
        <Route path="/register" element = {< RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
