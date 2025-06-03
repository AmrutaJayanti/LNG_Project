import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Carousel from '../components/Carousel';
import InviteModal from '../components/InviteModal'; // ⬅️ import it
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // ⬅️ state for modal

  const inviteFriend = () => {
    setShowModal(true); // ⬅️ open modal
  };

  return (
    <div className="container">
      <Header />
      <div className="content">
        <Carousel />
      </div>

      {/* Invite Button */}
      <button className="floating-button" onClick={inviteFriend}>
        <i className="fas fa-user-plus"></i>
      </button>

      {/* Show Modal */}
      {showModal && <InviteModal onClose={() => setShowModal(false)} />}

      {/* Bottom Navigation Buttons */}
      <div className="bottom-nav">
        <button onClick={() => navigate('/chat')}>
          <i className="fas fa-comments"></i>
          <span>Chat</span>
        </button>
        <button onClick={() => navigate('/game')}>
          <i className="fas fa-gamepad"></i>
          <span>Games</span>
        </button>
        <button onClick={() => navigate('/gamers')}>
          <i className="fas fa-users"></i>
          <span>Gamers</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
