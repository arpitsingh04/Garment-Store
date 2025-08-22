import React from 'react';
import HeroSection from '../components/home/HeroSection';
import JourneySection from '../components/home/JourneySection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/common/CTASection';
import InteractiveStats from '../components/interactive/InteractiveStats';
import InteractiveFAQ from '../components/interactive/InteractiveFAQ';
import InteractiveShowcase from '../components/interactive/InteractiveShowcase';
import './Home.css';

const Home: React.FC = () => {
  return (
    <main className="home-page">
      <HeroSection />
      <InteractiveStats />
      <InteractiveShowcase />
      <JourneySection />
      <TestimonialsSection />
      <InteractiveFAQ />
      <CTASection />
    </main>
  );
};

export default Home;
