import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// ✅ API to get all users (friends + invited)
router.get('/gamers/:id', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id)
      .populate('friends', 'fullName email')
      .populate('invites.from', 'fullName email');

    const result = [];

    // Add friends
    currentUser.friends.forEach(friend => {
      result.push({
        userId: friend._id,
        user: {
          fullName: friend.fullName || 'No Name',
          email: friend.email,
        },
        status: 'accepted',
      });
    });

    // Add invited users (not yet registered or pending/rejected)
    currentUser.invites.forEach(invite => {
      result.push({
        userId: invite._id,
        user: {
          fullName: '', // No name until registered
          email: invite.email,
        },
        status: invite.status,
      });
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

export default router;
