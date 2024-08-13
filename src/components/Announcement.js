import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import '../styles/components/Announcement.css';

const Announcement = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="announcement-container">
      <div className="announcement-content">
        <FontAwesomeIcon 
          icon={faArrowLeft} 
          onClick={handleBackClick} 
          className="announcement-back-icon"
        />
        <img src={logo} alt="EZ-Transit Logo" className="announcement-logo" />
        <h2>Announcement Management</h2>
        <div className="announcement-buttons">
          <div className="announcement-button" onClick={() => navigate('/add-announcement')}>
            <h3>Add<br />Announcement</h3>
            <button>Add New<br />Announcements</button>
          </div>
          <div className="announcement-button" onClick={() => navigate('/manage-announcements')}>
            <h3>Manage<br />Announcements</h3>
            <button>Manage Old<br />Announcements</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
