import express from 'express';
import {
  register,
  login,
  getMe,
  logout
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

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

export default router;