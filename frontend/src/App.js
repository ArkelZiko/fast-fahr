import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LogoPage from './pages/LogoPage';
import './styles/Global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/logo" element={<LogoPage />} />
      </Routes>
    </Router>
  );
}

export default App;