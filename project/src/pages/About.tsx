import React from 'react';
import AboutContent from '../components/about/AboutContent';
import CTASection from '../components/common/CTASection';
import './About.css';

const About: React.FC = () => {
  return (
    <main className="about-page">
      <div className="page-header">
        <div className="container">
          <h1>About Us</h1>
          <p>Learn more about Diamond Garment, our journey, values, and commitment to quality.</p>
        </div>
      </div>
      <AboutContent />
      <CTASection />
    </main>
  );
};

export default About;
