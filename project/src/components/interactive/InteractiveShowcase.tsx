import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import './InteractiveShowcase.css';

interface ShowcaseItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  features: string[];
}

const InteractiveShowcase: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showcaseItems: ShowcaseItem[] = [
    {
      id: 1,
      title: "Premium Hospital Scrubs",
      description: "Antimicrobial, comfortable, and professional medical uniforms designed for healthcare professionals.",
      image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Healthcare",
      features: ["Antimicrobial Fabric", "Moisture Wicking", "Easy Care", "Professional Fit"]
    },
    {
      id: 2,
      title: "Smart School Uniforms",
      description: "Durable, comfortable school uniforms that promote unity and pride among students.",
      image: "https://images.pexels.com/photos/764681/pexels-photo-764681.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Education",
      features: ["Wrinkle Resistant", "Color Fast", "Comfortable Fit", "Durable Material"]
    },
    {
      id: 3,
      title: "Industrial Safety Wear",
      description: "High-visibility, flame-resistant workwear designed for maximum safety and comfort.",
      image: "https://images.pexels.com/photos/8837141/pexels-photo-8837141.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Industrial",
      features: ["Flame Resistant", "High Visibility", "Reinforced Seams", "Multi-Pocket Design"]
    }
  ];

  const handleMouseMove = (e: React.MouseEvent, itemId: number) => {
    if (!containerRef.current) return;
    
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  return (
    <section className="interactive-showcase-section">
      <div className="container">
        <div className="showcase-header">
          <div className="sparkle-icon">
            <Sparkles size={32} />
          </div>
          <h2>Interactive Product Showcase</h2>
          <p>Experience our premium uniform collections with interactive 3D previews</p>
        </div>

        <div className="showcase-grid" ref={containerRef}>
          {showcaseItems.map((item) => (
            <div
              key={item.id}
              className={`showcase-card ${hoveredItem === item.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={(e) => {
                setHoveredItem(null);
                handleMouseLeave(e);
              }}
              onMouseMove={(e) => handleMouseMove(e, item.id)}
            >
              <div className="card-inner">
                <div className="card-image">
                  <img src={item.image} alt={item.title} />
                  <div className="image-overlay">
                    <div className="category-badge">{item.category}</div>
                  </div>
                </div>
                
                <div className="card-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  
                  <div className="features-list">
                    {item.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <Link to="/products" className="showcase-cta">
                    Explore Collection
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
              
              <div className="card-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveShowcase;
