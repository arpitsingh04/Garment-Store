import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import {  Pagination, Autoplay } from 'swiper/modules';
import { ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HeroSection.css';

interface SlideItem {
  id: number;
  image: string;
  title: string;
  description: string;
}

const slideItems: SlideItem[] = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/6823562/pexels-photo-6823562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Hospital Wear',
    description: 'Premium quality scrubs, gowns, and medical uniforms for healthcare professionals.',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/5212339/pexels-photo-5212339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'School Uniforms',
    description: 'Comfortable and durable school uniforms for all ages and requirements.',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/2568551/pexels-photo-2568551.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Sportswear',
    description: 'High-performance sportswear designed for comfort and endurance.',
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/7048043/pexels-photo-7048043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Hotel Uniforms',
    description: 'Elegant and professional hotel staff uniforms for all departments.',
  },
  {
    id: 5,
    image: 'https://images.pexels.com/photos/2752039/pexels-photo-2752039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Industrial Wear',
    description: 'Durable and safe industrial uniforms for various workplace environments.',
  },
];

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <h1>Premium Quality Uniforms for Every Industry</h1>
          <p>
            Diamond Garment specializes in manufacturing high-quality uniforms for hospitals, schools, hotels, 
            industrial sectors, and more. With decades of experience, we deliver exceptional products tailored 
            to your specific requirements.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn">
              Explore Products
            </Link>
            <a 
              href="/dgcatlog.pdf" 
              download="Diamond-Garment-Catalog.pdf"
              className="btn btn-outline"
            >
              Download Catalog
            </a>
          </div>
        </div>

        <div className="hero-slider">
          <Swiper
            modules={[ Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            // navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
          >
            {slideItems.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="slide-content">
                  <div className="slide-image">
                    <img src={slide.image} alt={slide.title} />
                  </div>
                  <div className="slide-info">
                    <h3>{slide.title}</h3>
                    <p>{slide.description}</p>
                    <Link to="/contact" className="btn slide-cta">
                      Enquire Now <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;