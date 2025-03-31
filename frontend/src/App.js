import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
      </Routes>
    </Router>
  );
}

export default App;