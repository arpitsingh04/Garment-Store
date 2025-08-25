import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import { getApiUrl, getAssetUrl } from '../../config/api';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './TestimonialsSection.css';

interface Testimonial {
  _id: string;
  name: string;
  title: string;
  company: string;
  image: string;
  testimonial: string;
  rating: number;
  featured: boolean;
  approved: boolean;
  createdAt: string;
}

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get correct image source
  const getImageSrc = (image: string) => {
    if (image.startsWith('http')) return image;
    const path = image.startsWith('/uploads/') ? image : `/uploads/${image}`;
    return getAssetUrl(path);
  };

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const apiUrl = getApiUrl('/testimonials');
        console.log('Fetching testimonials from:', apiUrl);
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success) {
          setTestimonials(data.data);
        } else {
          setError('Failed to load testimonials');
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={18}
          fill={i < rating ? 'var(--primary-red)' : 'none'}
          color={i < rating ? 'var(--primary-red)' : 'var(--primary-gray)'}
          className={`star ${i < rating ? 'filled' : ''}`}
        />
      );
    }
    return stars;
  };

  // Show loading state
  if (loading) {
    return (
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="testimonials-container">
            <div className="loading-message">
              <p>Loading testimonials...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="testimonials-container">
            <div className="error-message">
              <p>Unable to load testimonials. Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (testimonials.length === 0) {
    return (
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="testimonials-container">
            <div className="empty-message">
              <p>No testimonials available at the moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="section-title">What Our Clients Say</h2>
        <div className="testimonials-container">
          <div className="quote-icon left">
            <Quote size={60} color="var(--primary-red)" opacity={0.1} />
          </div>
          <div className="quote-icon right">
            <Quote size={60} color="var(--primary-red)" opacity={0.1} />
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={testimonials.length > 1}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial._id}>
                <div className="testimonial-slide">
                  <div className="testimonial-header">
                    <div className="testimonial-image">
                      <img 
                        src={getImageSrc(testimonial.image)} 
                        alt={testimonial.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getApiUrl('/placeholder/80/80');
                        }}
                      />
                    </div>
                    <div className="testimonial-meta">
                      <h3 className="author-name">{testimonial.name}</h3>
                      <p className="author-title">{testimonial.title}, {testimonial.company}</p>
                      <div className="testimonial-rating">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-content">
                    <p className="testimonial-text">{testimonial.testimonial}</p>
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

export default TestimonialsSection;