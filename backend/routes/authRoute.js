import express from 'express';
import { registerUser, loginUser, getMe, verifyOTP, forgotPassword, resetPassword } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Register Action
router.post('/register', registerUser);

// Verify OTP
router.post('/verify-otp', verifyOTP);

// Login Action
router.post('/login', loginUser);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

// Get Logged In User
router.get('/me', authMiddleware, getMe);

export default router;
