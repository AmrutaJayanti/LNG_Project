import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.png';
import './../styles/styles.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <div className="glass-card">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Live Networks & Games</h1>
        <p>Games & Socializing</p>

        <div className="btn-group">
          <button onClick={() => navigate('/register')} className="btn btn-register">Register</button>
          <button onClick={() => navigate('/login')} className="btn btn-login">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
