import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/components/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const { userId } = useParams(); // Get user ID from URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error("There was an error fetching the users!", error);
      }
    };

    fetchUsers();
  }, []);

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:5000/api/users/${id}`);
              setUsers(users.filter(user => user._id !== id));
              toast.success("User deleted successfully!");
            } catch (error) {
              console.error("There was an error deleting the user!", error);
              toast.error("Failed to delete user.");
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <div className="user-management-container">
      <FontAwesomeIcon 
        icon={faArrowLeft} 
        onClick={handleBackClick} 
        className="back-icon"
      />
      <h2 className="user-management-heading">User Management</h2>
      <p>Total Users: {users.length}</p>
      <table>
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>ID</th>
            <th>Full Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Wallet Balance</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id} className={user._id === userId ? 'highlight' : ''}>
              <td>{index + 1}</td>
              <td>{user._id}</td>
              <td>{user.fullname}</td>
              <td>{user.mobile}</td>
              <td>{user.email}</td>
              <td>{`Rs.${user.balance}`}</td> {/* Format balance */}
              <td>
                <button onClick={() => handleDelete(user._id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default UserManagement;
