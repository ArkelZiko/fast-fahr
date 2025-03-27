import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';
import '../styles/Global.css';

function LogoPage() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // Replace with your actual XAMPP server path
    fetch('http://localhost/fastfahr/backend/apis/UserApi.php')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
      })
      .catch(error => {
        console.error('Error fetching message:', error);
        setMessage('Error loading message');
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{message}</p>
        <Link to="/" className="App-link">
          Go Back Home
        </Link>
      </header>
    </div>
  );
}

export default LogoPage;