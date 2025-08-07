import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/menprof.css'; // import the CSS file

const MentorPasswordUpdate = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [mentor, setMentor] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  
const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/mentors/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMentor(res.data);
      } catch (err) {
        setError('Failed to load mentor profile');
      }
    };

    if (token) fetchMentor();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.put(
        `${API_BASE}/api/mentors/mentor/update-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage(res.data.message);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Password update failed');
    }
  };

  return (
    <div className="mentor-container">
      <h2>Mentor Profile</h2>

      {mentor ? (
        <div className="mentor-profile-box">
          <p><strong>Name:</strong> {mentor.name}</p>
          <p><strong>Email:</strong> {mentor.email}</p>
          <p><strong>Role:</strong> {mentor.role}</p>
        </div>
      ) : (
        <p>Loading mentor info...</p>
      )}

      <h3>Update Password</h3>
      <form onSubmit={handleSubmit} className="mentor-form">
        <div className="mentor-input-container">
          <input
            type={showOld ? 'text' : 'password'}
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="mentor-input"
          />
          <span onClick={() => setShowOld(!showOld)} className="mentor-icon">
            {showOld ? '🙈' : '👁️'}
          </span>
        </div>

        <div className="mentor-input-container">
          <input
            type={showNew ? 'text' : 'password'}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="mentor-input"
          />
          <span onClick={() => setShowNew(!showNew)} className="mentor-icon">
            {showNew ? '🙈' : '👁️'}
          </span>
        </div>

        <button type="submit" className="mentor-button"
         style={{ 
    padding: "10px 20px",       // smaller padding
    fontSize: "15px",          // smaller font
    borderRadius: "4px",
    marginLeft:'170px',
    width: "170px",            // reduced width
    // center text vertically
  }}
        >Update Password</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MentorPasswordUpdate;
