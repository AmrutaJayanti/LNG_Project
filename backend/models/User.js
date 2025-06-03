import mongoose from 'mongoose';

// Define the invite sub-schema
const inviteSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the sender
  email: { type: String }, // Email of the sender for invite tracking
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: null,
  },
  OTP: String,
  OTPExpiry: Date,
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  username: { // Added for user identification in the UI
    type: String,
    required: false,
    unique: true,
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of friend IDs
  invites: [inviteSchema], // Array of invites (pending, accepted, or rejected)
});

const User = mongoose.model('User', userSchema);
export default User;