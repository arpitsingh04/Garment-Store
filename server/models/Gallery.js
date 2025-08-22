import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Gallery item title is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Gallery image is required']
  },
  category: {
    type: String,
    required: [true, 'Gallery category is required'],
    enum: ['Hospital', 'School', 'Sports', 'Hotel', 'Industrial', 'Scout & NCC']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
