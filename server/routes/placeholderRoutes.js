import express from 'express';

const router = express.Router();

// Simple placeholder image endpoint
router.get('/:width/:height', (req, res) => {
  const { width, height } = req.params;
  const w = parseInt(width) || 80;
  const h = parseInt(height) || 80;
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <circle cx="${w/2}" cy="${h/2 - 10}" r="${Math.min(w, h)/6}" fill="#d1d5db"/>
      <rect x="${w/2 - w/8}" y="${h/2 + 5}" width="${w/4}" height="${h/8}" rx="2" fill="#d1d5db"/>
      <text x="${w/2}" y="${h - 10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#9ca3af">No Image</text>
    </svg>
  `;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
  res.send(svg);
});

export default router;