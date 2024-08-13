import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Approved.css';

const Approved = () => {
  const [topups, setTopups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopups = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/topups/approved');
        const data = await response.json();
        console.log('Approved top-ups fetched:', data);
        setTopups(data);
      } catch (error) {
        console.error('Error fetching approved top-up requests:', error);
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

  // Calculate total revenue
  const totalRevenue = topups.reduce((sum, topup) => sum + topup.amount, 0);

  return (
    <div className="topup-approved-container">
      <FontAwesomeIcon 
        icon={faArrowLeft} 
        onClick={handleBackClick} 
        className="back-icon"
      />
      <h2 className="topup-approved-heading">Approved Topup Requests</h2>
      <p className="topup-approved-count">Total Approved Requests: {topups.length}</p>
      <h3 className="total-revenue">Total Revenue: Rs.{totalRevenue}</h3>
      <div className="topup-approved-cards">
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

export default Approved;
