import express from 'express';
import {
  register,
  login,
  getMe,
  logout
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js'; // Import the User model

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
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin@123', 10);
    const admin = new User({
      name: 'Admin',
      email: 'diamondgarment@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin user', error });
  }
});

export default router;
