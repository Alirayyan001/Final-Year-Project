// AddAnnouncement.js

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/AddAnnouncement.module.css';


const AddAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAddAnnouncement = async () => {
    if (title.trim() === '' || content.trim() === '') {
      setError('Title and Content fields cannot be empty.');
      return;
    }

    try {
      const newAnnouncement = { title, content };
      await axios.post('http://localhost:5000/api/announcements', newAnnouncement);
      setTitle('');
      setContent('');
      setError('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("There was an error adding the announcement!", error);
    }
  };

  const handleBackClick = () => {
    navigate('/announcement');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <FontAwesomeIcon 
          icon={faArrowLeft} 
          onClick={handleBackClick} 
          className="back-icon"
        />
        <h2>Add Announcement</h2>
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <textarea 
          placeholder="Content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleAddAnnouncement}>Add Announcement</button>
        {showSuccess && <div className="success-notification">Announcement added successfully!</div>}
      </div>
    </div>
  );
};

export default AddAnnouncement;
