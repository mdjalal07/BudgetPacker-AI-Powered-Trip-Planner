import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Clean environment variables to prevent hidden whitespace/cr/lf issues
if (process.env.EMAIL_USER) process.env.EMAIL_USER = process.env.EMAIL_USER.trim();
if (process.env.EMAIL_PASS) process.env.EMAIL_PASS = process.env.EMAIL_PASS.replace(/\s/g, '');

// Mailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper: Send OTP
const sendOTP = async (email, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return;
  }

  const mailOptions = {
    from: `"BudgetPacker Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 BudgetPacker: Verify Your Email Address',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6366f1; text-align: center;">Welcome to BudgetPacker!</h2>
        <p>Thank you for joining our community of explorers. Please use the following code to verify your email address:</p>
        <div style="background: #f8fafc; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <h1 style="letter-spacing: 10px; color: #1e293b; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">
          Sent by BudgetPacker Team. <br/> 
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

// Register User
// @route   POST api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: 'User already exists' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    user = new User({ 
      name, 
      email, 
      password, 
      otp, 
      otpExpires,
      isVerified: false 
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Send Email in background to speed up redirect
    sendOTP(email, otp).catch(mailError => {
      console.error('Background Mail Error:', mailError);
    });

    res.json({ message: 'OTP sent to your email. Please verify.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Verify OTP
// @route   POST api/auth/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).send('Server error');
  }
};

// Login User
// @route   POST api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });
    if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Forgot Password
// @route   POST api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('--- DEVELOPMENT MODE: PASSWORD RESET LOG ---');
      console.log(`To: ${email}`);
      console.log(`Reset Token: ${resetToken}`);
      console.log(`Reset Link: http://localhost:5173/reset-password/${resetToken}`);
      console.log('---------------------------------------------');
      return res.json({ message: 'Reset code logged to terminal (Dev Mode)' });
    }

    const mailOptions = {
      from: `"BudgetPacker Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔑 BudgetPacker: Password Reset Request',
      html: `
        <h3>Reset Your Password</h3>
        <p>Please use the following code to reset your password:</p>
        <div style="background: #f8fafc; padding: 15px; text-align: center; font-family: monospace;">
          <b>${resetToken}</b>
        </div>
        <p>Or click this link: <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Password</a></p>
      `
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reset code sent to email' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).send('Server error');
  }
};

// Reset Password
// @route   POST api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).send('Server error');
  }
};

// Get current user profile
// @route   GET api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
