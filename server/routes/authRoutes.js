import express from 'express';
import {
  register,
  login,
  getMe,
  logout
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/register', protect, authorize('admin'), register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

router.post('/create-admin', async (req, res) => {
  try {
    // Check if admin already exists
    console.log('Checking for existing admin...');
    const existingAdmin = await User.findOne({ email: 'diamondgarment@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists');
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists'
      });
    }

    console.log('Creating new admin user...');
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin@123', salt);
    
    const admin = new User({
      name: 'Admin',
      email: 'diamondgarment@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Saving admin user...');
    const savedAdmin = await admin.save();
    console.log('Admin user saved successfully:', savedAdmin);

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully'
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin user',
      error: error.message,
      stack: error.stack
    });
  }
});

export default router;
