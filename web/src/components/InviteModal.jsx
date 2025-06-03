import React, { useState } from 'react';
import '../styles/InviteModal.css';

const InviteModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleInvite = async () => {
    if (!email) {
      setError('Please enter an email');
      return;
    }
    setError('');

    try {
      const res = await fetch('https://lng-project-1.onrender.com/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: user.id,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error sending invite');
      } else {
        alert(data.message || 'Invite sent!');
        onClose();
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Invite a Friend</h3>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <div className="modal-actions">
          <button onClick={handleInvite}>Send Invite</button>
          <button onClick={onClose} className="cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
