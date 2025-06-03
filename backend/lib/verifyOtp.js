import User from '../models/User.js'

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.OTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > user.OTPExpiry) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    user.verified = true;
    user.OTP = undefined;
    user.OTPExpiry = undefined;

    await user.save();

    res.status(200).json({ message: 'OTP verified successfully. You can now complete registration.' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export default verifyOtp;
