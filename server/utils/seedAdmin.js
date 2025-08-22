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
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@diamondgarment.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }
    
    await User.create({
      name: 'Admin User',
      email: 'admin@diamondgarment.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
