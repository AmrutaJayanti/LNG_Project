import { useEffect, useState } from 'react';
import './../styles/Gamers.css'

const Gamers = ({ currentUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`https://lng-project-1.onrender.com/api/gamers/${currentUser?.id}`);
      const resData = await res.json();
      setUsers(resData);
    };
    fetchUsers();
  }, [currentUser]);

  return (
    <div className='gamers-list'>
      <h4>People</h4>
      {users.length > 0 ? users.map(({ userId, user, status }) => (
        <div className='person-item' key={userId}>
          <div>
            <h3>{user?.fullName || 'Invited User'}</h3>
            <p>{user?.email}</p>
            <small>Status: {status}</small>
          </div>
        </div>
      )) : <p>No Users Found</p>}
    </div>
  );
};

export default Gamers;
