import React, { useEffect, useRef } from 'react';
import { Clock, Package, Users, Building } from 'lucide-react';
import './StatsSection.css';

interface StatItem {
  id: number;
  icon: React.ReactNode;
  count: number;
  title: string;
}

const statItems: StatItem[] = [
  {
    id: 1,
    icon: <Clock size={40} />,
    count: 20,
    title: 'Years of Experience',
  },
  {
    id: 2,
    icon: <Package size={40} />,
    count: 50000,
    title: 'Uniforms Delivered',
  },
  {
    id: 3,
    icon: <Users size={40} />,
    count: 1000,
    title: 'Happy Clients',
  },
  {
    id: 4,
    icon: <Building size={40} />,
    count: 10,
    title: 'Industries Served',
  },
];

const StatsSection: React.FC = () => {
  const countersRef = useRef<HTMLDivElement>(null);
  const statsAnimated = useRef(false);

  useEffect(() => {
    const animateCounters = () => {
      if (!countersRef.current || statsAnimated.current) return;

      const stats = countersRef.current.querySelectorAll('.stat-count');

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !statsAnimated.current) {
            statsAnimated.current = true;
            
            stats.forEach((stat) => {
              const target = parseInt(stat.getAttribute('data-target') || '0');
              let count = 0;
              const duration = 2000; // ms
              const increment = target / (duration / 16); // 60fps

              const updateCount = () => {
                if (count < target) {
                  count += increment;
                  stat.textContent = Math.floor(count).toLocaleString();
                  requestAnimationFrame(updateCount);
                } else {
                  stat.textContent = target.toLocaleString();
                }
              };

              updateCount();
            });

            observer.unobserve(countersRef.current);
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(countersRef.current);
    };

    animateCounters();

    window.addEventListener('scroll', animateCounters);
    return () => {
      window.removeEventListener('scroll', animateCounters);
    };
  }, []);

  return (
    <section className="stats-section">
      <div className="container">
        <h2 className="section-title">Our Achievements</h2>
        <div className="stats-container" ref={countersRef}>
          {statItems.map((stat) => (
            <div className="stat-card" key={stat.id}>
              <div className="stat-icon">{stat.icon}</div>
              <h3 className="stat-count" data-target={stat.count}>
                0
              </h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;