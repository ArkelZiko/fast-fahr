import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BuyingPage from "./pages/BuyingPage";
import HomePage from "./pages/HomePage";
import MessagesPage from "./pages/MessagesPage";
import SellingPage from "./pages/SellingPage";

function App() {
  return (
    <Router basename="/fastfahr">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/selling" element={<SellingPage />} />
        <Route path="/buying" element={<BuyingPage />} />
      </Routes>
    </Router>
  );
}

export default App;