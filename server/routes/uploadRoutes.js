import express from 'express';
import upload from '../utils/fileUpload.js';
import { protect, authorize } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, authorize('admin'), (req, res) => {
  // Use upload.single with a callback to catch Multer errors
  upload.single('image')(req, res, (err) => {
    if (err) {
      const message = typeof err === 'string' ? err : err.message || 'Upload error';
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Max size is 5MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a file'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          fileName: req.file.filename,
          filePath: `/uploads/${req.file.filename}`
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  });
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export default router;
