import mongoose from 'mongoose'
const ProfileSchema = new mongoose.Schema({
  userId: {                  // Reference to the User collection
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User'
  },
  discordName: {
    type: String,
    required: true,
    unique: true,
  },
  avatarUrl: {
    type: String,
    default: '',            
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'          
  }],
  inviteCode: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


const Profile = mongoose.model('Profile', ProfileSchema);
export default Profile;
