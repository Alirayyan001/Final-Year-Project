import { faBullhorn, faQrcode, faSignOutAlt, faTrain, faUser, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import '../styles/components/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <img src={logo} alt="EZ-Transit Logo" className="logo" />
        <h2>Admin Dashboard</h2>
        <div className="dashboard-buttons">
          <div className="dashboard-button" onClick={() => navigate('/user-management')}>
            <FontAwesomeIcon icon={faUser} className="dashboard-icon" />
            <h3>User<br />Management</h3>
            <button>Manage<br />Users</button>
          </div>
          <div className="dashboard-button" onClick={() => navigate('/topup-approval')}>
            <FontAwesomeIcon icon={faWallet} className="dashboard-icon" />
            <h3>Topup<br />Management</h3>
            <button>Manage<br />Topups</button>
          </div>
          <div className="dashboard-button" onClick={() => navigate('/announcement')}>
            <FontAwesomeIcon icon={faBullhorn} className="dashboard-icon" />
            <h3>Announcement<br />Management</h3>
            <button>Manage<br />Announcements</button>
          </div>
          <div className="dashboard-button" onClick={() => navigate('/qr-management')}>
            <FontAwesomeIcon icon={faQrcode} className="dashboard-icon" />
            <h3>QR Code<br />Management</h3>
            <button>Manage<br />QR Codes</button>
          </div>
          <div className="dashboard-button" onClick={() => navigate('/station-management')}>
            <FontAwesomeIcon icon={faTrain} className="dashboard-icon" />
            <h3>Station<br />Management</h3>
            <button>Manage<br />Stations</button>
          </div>
        </div>
        <button className="logout-button" onClick={() => navigate('/logout')}>
          <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
