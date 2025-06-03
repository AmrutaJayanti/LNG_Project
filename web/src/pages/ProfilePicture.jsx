import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/ProfilePage.css';

const API_BASE_URL = 'http://192.168.0.104:5000';

export default function ProfilePage() {
  const [discordName, setDiscordName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setMessage('No user token found');

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload._id;

        const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setDiscordName(data.discordName || '');
          setAvatarUrl(data.avatarUrl || '');
        } else {
          setMessage(data.message || 'Profile fetch failed');
        }
      } catch (err) {
        setMessage('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  const saveProfile = async () => {
    if (!discordName) return setMessage('Discord name is required');

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload._id;

      const response = await fetch(`${API_BASE_URL}/profile/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, discordName, avatarUrl }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage('Profile saved successfully');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-background">
      <div className="profile-container">
        <button className="close-button" onClick={() => navigate(-1)}>←</button>

        <div className="glass-box">
          <h2>Edit Profile</h2>
          {message && <p className="message">{message}</p>}

          <input
            type="text"
            placeholder="Discord Name"
            value={discordName}
            onChange={(e) => setDiscordName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Avatar URL (optional)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />

          <button
            className="primary-button"
            onClick={saveProfile}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
