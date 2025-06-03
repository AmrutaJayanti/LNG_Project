import User from '../models/User.js'
import nodemailer from 'nodemailer'

const sendOtp = async (req, res) => {
  const { email } = req.body

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    let user = await User.findOne({ email })

    if (!user) {
      user = new User({
        email,
        OTP: otp,
        OTPExpiry: Date.now() + 5 * 60 * 1000,
        verified: false,
      })
      await user.save()
    } else {
      user.OTP = otp
      user.OTPExpiry = Date.now() + 5 * 60 * 1000
      user.verified = false
      await user.save()
    }

    // Setup nodemailer transporter with your Gmail credentials in .env
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    })

    res.status(200).json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error('OTP sending error:', error)
    res.status(500).json({ message: 'Failed to send OTP' })
  }
}

export default sendOtp
