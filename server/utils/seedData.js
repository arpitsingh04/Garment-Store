import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Gallery from '../models/Gallery.js';
import Testimonial from '../models/Testimonial.js';

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diamond-garment');

// Sample product data
const productData = [
  {
    name: 'Hospital Scrubs',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Hospital',
    description: 'Comfortable and durable hospital scrubs for medical professionals.',
    featured: true,
  },
  {
    name: 'OT Gowns',
    image: 'https://images.pexels.com/photos/3279202/pexels-photo-3279202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Hospital',
    description: 'Sterile operation theatre gowns for surgeons and medical staff.',
  },
  {
    name: 'Lab Coats',
    image: 'https://images.pexels.com/photos/5327859/pexels-photo-5327859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Hospital',
    description: 'Professional lab coats for doctors, scientists, and laboratory technicians.',
  },
  {
    name: 'Primary School Uniform',
    image: 'https://images.pexels.com/photos/3933226/pexels-photo-3933226.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'School',
    description: 'Comfortable and durable primary school uniforms for children.',
    featured: true,
  },
  {
    name: 'High School Uniform',
    image: 'https://images.pexels.com/photos/5905901/pexels-photo-5905901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'School',
    description: 'Stylish and practical high school uniforms for teenagers.',
  },
  {
    name: 'Sports Jersey',
    image: 'https://images.pexels.com/photos/6183556/pexels-photo-6183556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Sports',
    description: 'High-performance sports jerseys for teams and individuals.',
  },
  {
    name: 'Track Suits',
    image: 'https://images.pexels.com/photos/5480849/pexels-photo-5480849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Sports',
    description: 'Comfortable and stylish track suits for sports and leisure.',
  },
  {
    name: 'Chef Uniform',
    image: 'https://images.pexels.com/photos/8975741/pexels-photo-8975741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Hotel',
    description: 'Professional chef uniforms for kitchen staff and culinary professionals.',
  },
  {
    name: 'Hotel Staff Uniform',
    image: 'https://images.pexels.com/photos/5992472/pexels-photo-5992472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Hotel',
    description: 'Elegant and professional uniforms for hotel staff and frontline personnel.',
  },
  {
    name: 'Factory Uniform',
    image: 'https://images.pexels.com/photos/8964391/pexels-photo-8964391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Industrial',
    description: 'Durable and safe factory uniforms for industrial workers.',
    featured: true,
  },
  {
    name: 'Scout Uniform',
    image: 'https://images.pexels.com/photos/6175156/pexels-photo-6175156.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Scout & NCC',
    description: 'Official scout uniforms for scouts and guides.',
  },
  {
    name: 'NCC Uniform',
    image: 'https://images.pexels.com/photos/3280130/pexels-photo-3280130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Scout & NCC',
    description: 'Standard NCC uniforms for cadets and officers.',
  },
];

// Sample gallery data
const galleryData = [
  {
    title: 'Medical Staff Uniforms',
    image: 'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Hospital',
  },
  {
    title: 'Nurse Uniforms',
    image: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Hospital',
  },
  {
    title: 'School Uniforms',
    image: 'https://images.pexels.com/photos/5905959/pexels-photo-5905959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'School',
  },
  {
    title: 'Sports Uniforms',
    image: 'https://images.pexels.com/photos/6177679/pexels-photo-6177679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Sports',
  },
  {
    title: 'Chef Uniforms',
    image: 'https://images.pexels.com/photos/977367/pexels-photo-977367.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Hotel',
  },
  {
    title: 'Factory Uniforms',
    image: 'https://images.pexels.com/photos/8964684/pexels-photo-8964684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Industrial',
  },
  {
    title: 'Scout Uniforms',
    image: 'https://images.pexels.com/photos/4553010/pexels-photo-4553010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Scout & NCC',
  },
  {
    title: 'Hospital Staff',
    image: 'https://images.pexels.com/photos/6615184/pexels-photo-6615184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Hospital',
  },
  {
    title: 'Student Uniforms',
    image: 'https://images.pexels.com/photos/5212701/pexels-photo-5212701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'School',
  },
];

// Sample testimonial data
const testimonialData = [
  {
    name: 'Dr. Rajesh Patel',
    title: 'Medical Director',
    company: 'City Hospital',
    image: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    testimonial: 'Diamond Garment has been our trusted partner for hospital uniforms for over 5 years. Their attention to detail and quality is exceptional. The staff uniforms are comfortable, durable, and meet all our hygiene standards. The team is professional and always delivers on time, making our procurement process seamless.',
    rating: 5,
    featured: true,
    approved: true
  },
  {
    name: 'Sarah D\'Souza',
    title: 'Principal',
    company: 'St. Mary\'s School',
    image: 'https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    testimonial: 'We\'ve been ordering school uniforms from Diamond Garment for our entire student body of over 800 students. The quality is consistently excellent, and their service is always professional and timely. They understand the unique requirements of educational institutions and deliver exactly what we need.',
    rating: 5,
    featured: true,
    approved: true
  },
  {
    name: 'Amit Shah',
    title: 'HR Manager',
    company: 'Industrial Solutions Ltd',
    image: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    testimonial: 'The industrial uniforms provided by Diamond Garment meet all our safety standards while ensuring comfort for our workers. Their attention to specific requirements is commendable. The fabric quality is excellent and withstands the demanding industrial environment perfectly.',
    rating: 4,
    featured: false,
    approved: true
  },
  {
    name: 'Priya Sharma',
    title: 'General Manager',
    company: 'Grand Hotel',
    image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    testimonial: 'Outstanding quality and service! The hotel staff uniforms are elegant and practical. Diamond Garment understands the hospitality industry\'s needs perfectly. Our staff looks professional and feels comfortable throughout their shifts. Highly recommended for hospitality businesses.',
    rating: 5,
    featured: true,
    approved: true
  },
  {
    name: 'Ravi Kumar',
    title: 'Operations Manager',
    company: 'Tech Solutions Pvt Ltd',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    testimonial: 'Diamond Garment has transformed our corporate uniform program. The quality of their corporate wear is exceptional, and the fit is perfect for all our employees. Their customer service team is responsive and always ready to accommodate our specific requirements and bulk orders.',
    rating: 5,
    featured: false,
    approved: true
  }
];

// Import all data
const importData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await Gallery.deleteMany();
    await Testimonial.deleteMany();

    // Import products
    await Product.insertMany(productData);
    console.log('Products imported successfully');

    // Import gallery items
    await Gallery.insertMany(galleryData);
    console.log('Gallery items imported successfully');

    // Import testimonials
    await Testimonial.insertMany(testimonialData);
    console.log('Testimonials imported successfully');

    console.log('All data imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
