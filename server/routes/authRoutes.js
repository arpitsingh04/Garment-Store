import express from 'express';
import {
  register,
  login,
  getMe,
  logout
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

// Protected routes
router.post('/register', protect, authorize('admin'), register);
router.get('/me', protect, getMe);
router.get('/logout', logout);

// Admin creation route (for initial setup)
router.post('/create-admin', async (req, res) => {
  try {
    console.log('Admin creation request received');
    
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists'
      });
    }

    console.log('Creating new admin user...');
    const admin = new User({
      name: 'Admin User',
      email: 'admin@diamondgarment.com',
      password: 'admin123',
      role: 'admin'
    });

    const savedAdmin = await admin.save();
    console.log('Admin user created successfully:', savedAdmin.email);

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        email: savedAdmin.email,
        name: savedAdmin.name
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin user',
      error: error.message
    });
  }
});

// Emergency admin reset route (remove in production)
router.post('/reset-admin', async (req, res) => {
  try {
    // Delete all existing admins
    await User.deleteMany({ role: 'admin' });
    
    // Create new admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@diamondgarment.com',
      password: 'admin123',
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin reset successful',
      data: {
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error('Error resetting admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting admin',
      error: error.message
    });
  }
});

export default router;