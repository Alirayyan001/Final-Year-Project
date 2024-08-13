import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Declined.css';

const Declined = () => {
  const [topups, setTopups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopups = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/topups/declined');
        const data = await response.json();
        console.log('Declined top-ups fetched:', data);
        setTopups(data);
      } catch (error) {
        console.error('Error fetching declined top-up requests:', error);
      }
    };

    fetchTopups();
  }, []);

  const handleBackClick = () => {
    navigate('/topup-approval');
  };

  const handleUserClick = (userId) => {
    navigate(`/user-management/${userId}`);
  };

  return (
    <div className="topup-declined-container">
      <FontAwesomeIcon 
        icon={faArrowLeft} 
        onClick={handleBackClick} 
        className="back-icon"
      />
      <h2 className="topup-declined-heading">Declined Topup Requests</h2>
      <p className="topup-declined-count">Total Declined Requests: {topups.length}</p>
      <div className="topup-declined-cards">
        {topups.map((topup, index) => (
          <div key={topup._id} className="topup-card">
            <h3>Request #{index + 1}</h3>
            <p>
              <strong>User ID: </strong> 
              <span 
                className="user-id" 
                onClick={() => handleUserClick(topup.user)}
              >
                {topup.user}
              </span>
            </p>
            <p className="topup-amount"><strong>Amount:</strong> Rs.{topup.amount}</p>
            <p><strong>Date:</strong> {new Date(topup.date).toLocaleString()}</p>
            <p><strong>Status:</strong> {topup.status}</p>
            <p><strong>Account Type:</strong> {topup.accountType}</p>
            <p><strong>Account Number:</strong> {topup.accountNumber}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Declined;
