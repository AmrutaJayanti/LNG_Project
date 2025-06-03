import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendOtp from '../lib/sendOtp.js';
import verifyOtp from '../lib/verifyOtp.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Configure transporter for email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// === OTP ROUTES ===
router.post('/sendotp', sendOtp);
router.post('/verifyotp', verifyOtp);

// === REGISTER ROUTE ===
router.post('/register', async (req, res) => {
  try {
    let { fullName, email, password, confirmpassword, inviteFrom } = req.body;

    if (!email || !password || !confirmpassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if already registered
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: 'Please verify OTP first' });
    }

    if (!existingUser.verified) {
      return res.status(400).json({ message: 'Email not verified. Complete OTP verification first.' });
    }

    if (existingUser.password) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = (fullName && fullName.trim()) || email.split('@')[0];

    existingUser.password = hashedPassword;
    existingUser.username = username;

    // Invitation handling
    if (inviteFrom) {
      const inviter = await User.findById(inviteFrom);
      if (inviter) {
        const invite = inviter.invites?.find(inv => inv.email === email);
        if (invite) {
          invite.status = 'accepted';
        }

        if (!inviter.friends.includes(existingUser._id)) {
          inviter.friends.push(existingUser._id);
        }
        existingUser.friends.push(inviter._id);
        await inviter.save();
      }
    }

    await existingUser.save();

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// === LOGIN ROUTE ===
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// === INVITE ROUTE ===
router.post('/invite', async (req, res) => {
  console.log('Invite request received');
  const { fromUserId, email } = req.body;

  try {
    const fromUser = await User.findById(fromUserId);
    if (!fromUser) return res.status(404).json({ message: 'Inviter not found' });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const inviteLink = `http://localhost:5173/signup?inviteFrom=${fromUserId}&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `${fromUser.username || fromUser.email} has invited you!`,
      html: `
        <p>Hello,</p>
        <p>${fromUser.username || fromUser.email} has invited you to join the app.</p>
        <p>Click <a href="${inviteLink}">here</a> to sign up and connect.</p>
        <p>This link includes your email and will add you as a friend automatically.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Invite sent successfully via email.' });

  } catch (err) {
    console.error('Error sending invite:', err);
    res.status(500).json({ message: 'Failed to send invite' });
  }
});

export default router;
