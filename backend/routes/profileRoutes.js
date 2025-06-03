// backend/routes/profile.js
import express from 'express';
const router = express.Router();
import Profile from './../models/Profile.js';
import { v4 as uuidv4 } from 'uuid';

// Create or Update Profile
router.post('/create', async (req, res) => {
  const { userId, discordName, avatarUrl } = req.body; // Accept avatarUrl
  try {
    let profile = await Profile.findOne({ userId });

    if (profile) {
      // Update discordName and avatarUrl
      profile.discordName = discordName;
      if (avatarUrl !== undefined) {
        profile.avatarUrl = avatarUrl || ''; // Allow empty string to clear avatarUrl
      } else if (!profile.avatarUrl) {
        // Set default only if avatarUrl is unset
        profile.avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(discordName)}`;
      }
    } else {
      profile = new Profile({
        userId,
        discordName,
        inviteCode: uuidv4(),
        avatarUrl: avatarUrl || `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(discordName)}`,
      });
    }

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get Profile by userId
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).populate('friends');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile); // Return profile directly
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

export default router;