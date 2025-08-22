import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Award, Users, Zap, Building } from 'lucide-react';
import './JourneySection.css';

interface JourneyItem {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  achievement: string;
  color: string;
}

const journeyItems: JourneyItem[] = [
  {
    year: '1998',
    title: 'Foundation',
    description: 'Diamond Garment was established with a vision to provide high-quality uniforms for various industries.',
    icon: <Calendar size={28} />,
    achievement: 'Company Founded',
    color: '#4CAF50'
  },
  {
    year: '2005',
    title: 'First Milestone',
    description: 'Received our first major industry recognition and expanded our client base significantly.',
    icon: <Award size={28} />,
    achievement: 'Industry Recognition',
    color: '#2196F3'
  },
  {
    year: '2012',
    title: 'Major Expansion',
    description: 'Expanded operations to serve over 1000+ clients across multiple industries including healthcare and education.',
    icon: <Users size={28} />,
    achievement: '1000+ Clients',
    color: '#FF9800'
  },
  {
    year: '2018',
    title: 'Modernization',
    description: 'Upgraded machinery and implemented modern manufacturing processes for better quality and efficiency.',
    icon: <Building size={28} />,
    achievement: 'Modern Facility',
    color: '#9C27B0'
  },
  {
    year: '2023',
    title: 'Digital Innovation',
    description: 'Launched online presence and introduced sustainable manufacturing processes for eco-friendly uniforms.',
    icon: <Zap size={28} />,
    achievement: 'Digital Transformation',
    color: '#E91E63'
  },
];

const JourneySection: React.FC = () => {
  const [activeItem, setActiveItem] = useState<number>(0);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = parseInt(entry.target.getAttribute('data-id') || '0');
            setVisibleItems(prev => new Set([...prev, itemId]));
          }
        });
      },
      { threshold: 0.3 }
    );

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  // Auto-advance active item
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItem(prev => (prev + 1) % journeyItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="journey-section" ref={sectionRef}>
      <div className="container">
        <div className="journey-header">
          <h2 className="section-title">Our Journey Through Time</h2>
          <p className="section-subtitle">
            Discover the milestones that shaped Diamond Garment into the industry leader we are today
          </p>
        </div>

        <div className="journey-container">
          <div className="timeline-line">
            <div className="timeline-progress" style={{ height: `${(activeItem + 1) * 20}%` }}></div>
          </div>

          <div className="journey-timeline">
            {journeyItems.map((item, index) => (
              <div
                key={index}
                className={`timeline-item ${visibleItems.has(index) ? 'visible' : ''} ${
                  activeItem === index ? 'active' : ''
                } ${index % 2 === 0 ? 'left' : 'right'}`}
                data-id={index}
                onClick={() => setActiveItem(index)}
              >
                <div className="timeline-content">
                  <div className="timeline-icon" style={{ backgroundColor: item.color }}>
                    {item.icon}
                  </div>

                  <div className="timeline-info">
                    <div className="timeline-year">{item.year}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="achievement-badge" style={{ borderColor: item.color }}>
                      {item.achievement}
                    </div>
                  </div>
                </div>

                <div className="timeline-dot" style={{ borderColor: item.color }}>
                  <div className="dot-inner" style={{ backgroundColor: item.color }}></div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>
    </section>
  );
};

export default JourneySection;