import React, { useState, useEffect, useRef } from 'react';
import { Users, Award, Package, Star, TrendingUp, Shield } from 'lucide-react';
import './InteractiveStats.css';

interface StatItem {
  id: number;
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  color: string;
  description: string;
}

const InteractiveStats: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<{[key: number]: number}>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats: StatItem[] = [
    {
      id: 1,
      icon: <Users size={36} />,
      value: 5000,
      label: 'Happy Customers',
      suffix: '+',
      color: '#4CAF50',
      description: 'Satisfied clients across various industries'
    },
    {
      id: 2,
      icon: <Award size={36} />,
      value: 25,
      label: 'Years Experience',
      suffix: '+',
      color: '#2196F3',
      description: 'Decades of expertise in uniform manufacturing'
    },
    {
      id: 3,
      icon: <Package size={36} />,
      value: 10000,
      label: 'Products Delivered',
      suffix: '+',
      color: '#FF9800',
      description: 'High-quality uniforms delivered on time'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    stats.forEach((stat) => {
      let startValue = 0;
      const endValue = stat.value;
      const duration = 5000; // 5 seconds
      const increment = endValue / (duration / 16); // 60fps

      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= endValue) {
          startValue = endValue;
          clearInterval(timer);
        }
        setAnimatedValues(prev => ({
          ...prev,
          [stat.id]: Math.floor(startValue)
        }));
      }, 16);
    });
  };

  return (
    <section className="interactive-stats-section" ref={sectionRef}>
      <div className="container">
        <div className="stats-header">
          <div className="header-badge">
            <TrendingUp size={20} />
            <span>Our Achievements</span>
          </div>
          <h2>Numbers That Define Excellence</h2>
          <p>Discover the milestones that showcase our commitment to quality and customer satisfaction</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`stat-card ${isVisible ? 'animate' : ''} ${hoveredCard === stat.id ? 'hovered' : ''}`}
              style={{
                animationDelay: `${stat.id * 0.15}s`,
                '--card-color': stat.color
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredCard(stat.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="stat-card-inner">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="icon-glow" style={{ backgroundColor: stat.color }}></div>
                </div>

                <div className="stat-content">
                  <div className="stat-number">
                    {stat.prefix}
                    <span className="counter">
                      {animatedValues[stat.id] || 0}
                    </span>
                    {stat.suffix}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-description">{stat.description}</div>
                </div>

                <div className="stat-progress">
                  <div
                    className="progress-bar"
                    style={{
                      backgroundColor: stat.color,
                      width: isVisible ? '100%' : '0%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveStats;
