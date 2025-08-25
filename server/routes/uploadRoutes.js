import express from 'express';
import upload from '../utils/fileUpload.js';
import { protect, authorize } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Optional Cloudinary support
let cloudinary = null;
try {
  // Defer require to runtime; if not installed, we'll gracefully fallback
  // eslint-disable-next-line import/no-extraneous-dependencies
  cloudinary = await import('cloudinary');
} catch (e) {
  cloudinary = null;
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Determine if Cloudinary is configured
const cloudinaryConfigured = !!(
  process.env.CLOUDINARY_URL || (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  )
);

if (cloudinary && cloudinaryConfigured) {
  const { v2: cloud } = cloudinary;
  cloud.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// Ensure uploads directory exists for local fallback
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, authorize('admin'), (req, res) => {
  // Parse single file from memory
  upload.single('image')(req, res, async (err) => {
    if (err) {
      const message = typeof err === 'string' ? err : err.message || 'Upload error';
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Max size is 5MB.'
        });
      }
      return res.status(400).json({ success: false, message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a file' });
      }

      const originalName = req.file.originalname || 'image';
      const safeName = `${Date.now()}-${originalName}`.replace(/[^a-zA-Z0-9_.-]/g, '_');

      // If Cloudinary available and configured, upload there
      if (cloudinary && cloudinaryConfigured) {
        const { v2: cloud } = cloudinary;

        const uploadToCloudinary = () => new Promise((resolve, reject) => {
          const stream = cloud.uploader.upload_stream(
            {
              folder: 'diamond-garment/uploads',
              resource_type: 'image',
              public_id: path.parse(safeName).name,
              overwrite: false,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        try {
          const result = await uploadToCloudinary();
          return res.status(200).json({
            success: true,
            data: {
              fileName: result.public_id,
              filePath: result.secure_url,
              storage: 'cloudinary'
            }
          });
        } catch (cloudErr) {
          // Fall back to local disk if cloudinary fails
          console.error('Cloudinary upload failed, falling back to local:', cloudErr);
        }
      }

      // Local fallback: write to disk and return relative path
      const targetPath = path.join(uploadsDir, safeName);
      await fs.promises.writeFile(targetPath, req.file.buffer);

      return res.status(200).json({
        success: true,
        data: {
          fileName: safeName,
          filePath: `/uploads/${safeName}`,
          storage: 'local'
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  });
});

export default router;
