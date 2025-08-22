import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Gallery from '../models/Gallery.js';
import Testimonial from '../models/Testimonial.js';
import Contact from '../models/Contact.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Clear all data
const clearData = async () => {
  try {
    console.log('Clearing all data from database...');
    
    // Clear all collections
    await Product.deleteMany();
    console.log('Products cleared');
    
    await Gallery.deleteMany();
    console.log('Gallery items cleared');
    
    await Testimonial.deleteMany();
    console.log('Testimonials cleared');
    
    await Contact.deleteMany();
    console.log('Contact submissions cleared');
    
    console.log('All data cleared successfully');
    process.exit();
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }
};

clearData();
