import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import '../styles/components/StationManagement.css';

const StationManagement = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="station-management-container">
      <div className="station-management-content">
        <FontAwesomeIcon 
          icon={faArrowLeft} 
          onClick={handleBackClick} 
          className="station-management-back-icon"
        />
        <img src={logo} alt="EZ-Transit Logo" className="station-management-logo" />
        <h2>Station Management</h2>
        <div className="station-management-buttons">
          <div className="station-management-button" onClick={() => navigate('/add-station')}>
            <h3>Add<br />Station</h3>
            <button>Add New<br />Station</button>
          </div>
          <div className="station-management-button" onClick={() => navigate('/manage-stations')}>
            <h3>Manage<br />Stations</h3>
            <button>Manage Old<br />Stations</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationManagement;
