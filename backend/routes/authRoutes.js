import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import sendOtp from '../lib/sendOtp.js'
import verifyOtp from '../lib/verifyOtp.js'
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


// Configure transporter with your email credentials (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const router = express.Router()


router.post('/sendotp', sendOtp)


router.post('/verifyotp', verifyOtp)


router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, confirmpassword, inviteFrom } = req.body;
  
    if (!email || !password || !confirmpassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
      if (!fullName) fullName = email.split('@')[0];
    if (password !== confirmpassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      email,
      password: hashedPassword,
      verified: true,
      username: fullName,
      friends: [],
    });

    // Handle invitation
    if (inviteFrom) {
      const inviter = await User.findById(inviteFrom);
      if (inviter) {
        // ✅ Update the invite status if one exists
        const invite = inviter.invites.find(inv => inv.email === email);
        if (invite) {
          invite.status = 'accepted';
        }

        // ✅ Add each other as friends
        if (!inviter.friends.includes(newUser._id)) {
          inviter.friends.push(newUser._id);
        }
        newUser.friends.push(inviter._id);

        await inviter.save(); // Save inviter updates
      }
    }

    await newUser.save(); // Save new user

    res.status(200).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

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
      subject: `${fromUser.fullName || fromUser.email} has invited you!`,
      html: `
        <p>Hello,</p>
        <p>${fromUser.fullName || fromUser.email} has invited you to join the app.</p>
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



export default router
