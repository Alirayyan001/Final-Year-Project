import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import '../styles/components/QRManagement.css';

const QRManagement = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="qr-management-container">
      <div className="qr-management-content">
        <FontAwesomeIcon 
          icon={faArrowLeft} 
          onClick={handleBackClick} 
          className="qr-management-back-icon"
        />
        <img src={logo} alt="EZ-Transit Logo" className="qr-management-logo" />
        <h2>QR Code Management</h2>
        <div className="qr-management-buttons">
          <div className="qr-management-button" onClick={() => navigate('/add-qr')}>
            <h3>Add<br />QR Code</h3>
            <button>Add New<br />QR Code</button>
          </div>
          <div className="qr-management-button" onClick={() => navigate('/manage-qr')}>
            <h3>Manage<br />QR Codes</h3>
            <button>Manage Old<br />QR Codes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRManagement;
