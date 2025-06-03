import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './../assets/images/Logo.png';
import './../styles/Header.css';

const API_BASE_URL = 'https://lng-project.onrender.com';
const DEFAULT_AVATAR = 'https://api.dicebear.com/9.x/pixel-art/svg?seed=AMRUTA';

const Header = () => {
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) return;

        const payload = JSON.parse(atob(tokenParts[1]));
        const userId = payload._id;

        const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
        const data = await response.json();

        if (response.ok && data.avatarUrl) {
          setAvatarUrl(data.avatarUrl);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="header-container">
      <img src={logo} alt="Logo" className="logo" />
      <div onClick={() => navigate('/profilepage')} className="avatar-container">
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          <img src={avatarUrl} alt="avatar" className="avatar" />
        )}
      </div>
    </header>
  );
};

export default Header;
