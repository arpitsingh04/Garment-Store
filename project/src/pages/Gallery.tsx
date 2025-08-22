import React from 'react';
import GalleryGrid from '../components/gallery/GalleryGrid';
import CTASection from '../components/common/CTASection';
import './Gallery.css';

const Gallery: React.FC = () => {
  return (
    <main className="gallery-page">
      <div className="page-header">
        <div className="container">
          <h1>Our Gallery</h1>
          <p>View our collection of high-quality uniforms and satisfied clients.</p>
        </div>
      </div>
      <GalleryGrid />
      <CTASection />
    </main>
  );
};

export default Gallery;
