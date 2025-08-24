import express from 'express';
import { body } from 'express-validator';
import {
  getTestimonials,
  getAllTestimonialsAdmin,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Custom image validator that accepts both URLs and local upload paths
const imageValidator = (value) => {
  if (!value) return false;
  // Accept full URLs (http/https)
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return true;
  }
  // Accept local upload paths
  if (value.startsWith('/uploads/')) {
    return true;
  }
  return false;
};

// Validation rules
const testimonialValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('title')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Title must be between 2 and 150 characters'),
  body('company')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Company name must be between 2 and 150 characters'),
  body('image')
    .notEmpty()
    .withMessage('Image is required')
    .custom(imageValidator)
    .withMessage('Image must be a valid URL or upload path'),
  body('testimonial')
    .trim()
    .isLength({ min: 100, max: 1000 })
    .withMessage('Testimonial must be between 100 and 1000 characters (approximately 20-200 words)'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  body('approved')
    .optional()
    .isBoolean()
    .withMessage('Approved must be a boolean value')
];

// Public routes
router.get('/', getTestimonials);

// Protected admin routes - IMPORTANT: Put specific routes before parameterized ones
router.get('/admin/all', protect, getAllTestimonialsAdmin);
router.get('/:id', getTestimonial);
router.post('/', protect, testimonialValidation, createTestimonial);
router.put('/:id', protect, testimonialValidation, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

export default router;