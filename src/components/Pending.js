import { faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Pending.css';

const Pending = () => {
  const [topups, setTopups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopups = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/topups');
        const data = await response.json();
        console.log('Top-ups fetched:', data);
        setTopups(data.filter(topup => topup.status === 'pending'));
      } catch (error) {
        console.error('Error fetching top-up requests:', error);
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

  const handleApprove = async (topupId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/topups/${topupId}/approve`, {
        method: 'POST',
      });
      const data = await response.json();
      console.log('Approve response:', response.status, data);

      if (response.ok) {
        setTopups(topups.filter(topup => topup._id !== topupId));
      }
    } catch (error) {
      console.error('Error approving top-up request:', error);
    }
  };

  const handleDecline = async (topupId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/topups/${topupId}/decline`, {
        method: 'POST',
      });
      const data = await response.json();
      console.log('Decline response:', response.status, data);

      if (response.ok) {
        setTopups(topups.filter(topup => topup._id !== topupId));
      }
    } catch (error) {
      console.error('Error declining top-up request:', error);
    }
  };

  const handleDelete = async (topupId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/topups/${topupId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTopups(topups.filter(topup => topup._id !== topupId));
      }
    } catch (error) {
      console.error('Error deleting top-up request:', error);
    }
  };

  return (
    <div className="topup-approval-container">
      <FontAwesomeIcon 
        icon={faArrowLeft} 
        onClick={handleBackClick} 
        className="back-icon"
      />
      <h2 className="topup-approval-heading">Topup Management</h2>
      <p className="topup-approval-count">Pending Top-up Requests: {topups.length}</p>
      <div className="topup-approval-cards">
        {topups.map((topup, index) => (
          <div key={topup._id} className="topup-card">
            <FontAwesomeIcon 
              icon={faTimes} 
              className="delete-icon" 
              onClick={() => handleDelete(topup._id)}
            />
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
            <div className="action-buttons">
              <button 
                className="approve-button" 
                onClick={() => handleApprove(topup._id)}
              >
                Approve
              </button>
              <button 
                className="decline-button" 
                onClick={() => handleDecline(topup._id)}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pending;
