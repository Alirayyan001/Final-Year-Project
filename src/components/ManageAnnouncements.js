import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/ManageAnnouncements.css';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/announcements');
        setAnnouncements(response.data);
      } catch (error) {
        console.error("There was an error fetching the announcements!", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${id}`);
      setAnnouncements(announcements.filter(announcement => announcement._id !== id));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("There was an error deleting the announcement!", error);
    }
  };

  const handleBackClick = () => {
    navigate('/announcement');
  };

  const openDeleteDialog = (id) => {
    setShowDeleteDialog(true);
    setDeleteId(id);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <FontAwesomeIcon 
          icon={faArrowLeft} 
          onClick={handleBackClick} 
          className="back-icon"
        />
        <h2>Manage Announcements</h2>
        <div className="announcement-list">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="announcement-item">
              <h3>{announcement.title}</h3>
              <p className="announcement-content">{announcement.content}</p>
              <p className="announcement-date">
                Added on: {new Date(announcement.createdAt).toLocaleDateString()} at {new Date(announcement.createdAt).toLocaleTimeString()}
              </p>
              <button className="delete-button" onClick={() => openDeleteDialog(announcement._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog-container">
          <div className="dialog-box">
            <p>Are you sure you want to delete this announcement?</p>
            <div className="dialog-buttons">
              <button onClick={() => handleDeleteAnnouncement(deleteId)}>Yes</button>
              <button onClick={closeDeleteDialog}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnnouncements;
