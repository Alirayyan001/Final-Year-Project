import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import '../styles/components/TopupApproval.css';

const TopupApproval = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="topup-container">
      <div className="topup-content">
        <FontAwesomeIcon 
          icon={faArrowLeft} 
          onClick={handleBackClick} 
          className="topup-back-icon"
        />
        <img src={logo} alt="EZ-Transit Logo" className="topup-logo" />
        <h2>Topup Approval Management</h2>
        <div className="topup-buttons">
          <div className="topup-button" onClick={() => navigate('/pending')}>
            <h3>Pending<br />Topups</h3>
            <button>View<br />Pending</button>
          </div>
          <div className="topup-button" onClick={() => navigate('/approved')}>
            <h3>Approved<br />Topups</h3>
            <button>View<br />Approved</button>
          </div>
          <div className="topup-button" onClick={() => navigate('/declined')}>
            <h3>Declined<br />Topups</h3>
            <button>View<br />Declined</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopupApproval;
