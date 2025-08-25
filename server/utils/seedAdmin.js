import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diamond-garment');

// Create admin user
const createAdmin = async () => {
  try {
    console.log('Starting admin creation process...');
    
    // Delete existing admin if exists
    await User.deleteOne({ email: 'admin@diamondgarment.com' });
    console.log('Cleared existing admin user');
    
    // Create new admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@diamondgarment.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('Admin user created successfully:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
    
    // Verify the admin was created
    const verifyAdmin = await User.findOne({ email: 'admin@diamondgarment.com' }).select('+password');
    console.log('Admin verification:', {
      found: !!verifyAdmin,
      email: verifyAdmin?.email,
      hasPassword: !!verifyAdmin?.password
    });
    
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();