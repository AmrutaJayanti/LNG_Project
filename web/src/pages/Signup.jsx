import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get invite details from URL query params
  const queryParams = new URLSearchParams(location.search);
  const emailFromInvite = queryParams.get('email') || '';
  const inviteFrom = queryParams.get('inviteFrom') || '';

  const [form, setForm] = useState({
    fullName: '',
    email: emailFromInvite,
    password: '',
    confirmpassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmpassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://lng-project-1.onrender.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          inviteFrom, // Include the inviter's ID if present
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Complete Your Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          type="text"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          readOnly
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="confirmpassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmpassword}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
