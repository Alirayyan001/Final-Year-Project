// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Logout.css';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any session or authentication data here
    localStorage.removeItem('authToken'); // Example: removing a token from localStorage

    // Redirect to the login page
    navigate('/');
  }, [navigate]);

  return (
    <div className="logout-container">
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
