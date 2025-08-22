import Testimonial from '../models/Testimonial.js';
import { validationResult } from 'express-validator';

// Get all testimonials (public - only approved)
export const getTestimonials = async (req, res) => {
  try {
    const { featured } = req.query;
    
    let query = { approved: true };
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    const testimonials = await Testimonial.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
};

// Get all testimonials (admin - including unapproved)
export const getAllTestimonialsAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
};

// Get single testimonial
export const getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonial',
      error: error.message
    });
  }
};

// Create testimonial
export const createTestimonial = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, title, company, image, testimonial, rating, featured, approved } = req.body;
    
    const newTestimonial = new Testimonial({
      name,
      title,
      company,
      image,
      testimonial,
      rating: parseInt(rating),
      featured: featured === 'true' || featured === true,
      approved: approved === 'true' || approved === true
    });
    
    const savedTestimonial = await newTestimonial.save();
    
    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: savedTestimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating testimonial',
      error: error.message
    });
  }
};

// Update testimonial
export const updateTestimonial = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, title, company, image, testimonial, rating, featured, approved } = req.body;
    
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        name,
        title,
        company,
        image,
        testimonial,
        rating: parseInt(rating),
        featured: featured === 'true' || featured === true,
        approved: approved === 'true' || approved === true
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updatedTestimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating testimonial',
      error: error.message
    });
  }
};

// Delete testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial',
      error: error.message
    });
  }
};
