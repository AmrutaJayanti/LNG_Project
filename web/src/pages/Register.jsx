import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/styles.css';

const API_BASE_URL = 'http://localhost:5000';

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Request failed');
    return json;
  };

  const sendOtp = async () => {
    if (!email) return setMessage('Please enter your email');
    setLoading(true);
    try {
      const res = await postData(`${API_BASE_URL}/auth/sendotp`, { email });
      setMessage(res.message);
      setStep(2);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return setMessage('Please enter OTP');
    setLoading(true);
    try {
      const res = await postData(`${API_BASE_URL}/auth/verifyotp`, { email, otp });
      setMessage(res.message);
      setStep(3);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    if (!password || !confirmPassword) {
      setMessage('Please enter both password fields');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await postData(`${API_BASE_URL}/auth/register`, { email, password ,confirmpassword:confirmPassword });
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="glass-card register-card">
        <h2 className="title">Register</h2>

        {message && <p className="error">{message}</p>}

        {step === 1 && (
          <>
            <input
              className="input-field"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn" onClick={sendOtp} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              className="input-field"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="btn" onClick={verifyOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="input-field"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="btn" onClick={register} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </>
        )}

        <p className="redirect-text">
          Already have an account?{' '}
          <span
            style={{ color: '#116a5a', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
