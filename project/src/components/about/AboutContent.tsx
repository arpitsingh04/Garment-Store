import React from 'react';
import { CheckCircle, Shirt, Award, Clock } from 'lucide-react';
import './AboutContent.css';
import dgudyamImage from '../../assets/images/dgudyam.jpg';

const AboutContent: React.FC = () => {
  return (
    <section className="about-content-section">
      <div className="container">
        <div className="about-intro">
          <div className="about-intro-image">
            <img 
              src={dgudyamImage} 
              alt="Diamond Garment Factory" 
            />
          </div>
          <div className="about-intro-content">
            <h2>Who We Are</h2>
            <p>
              Diamond Garment is a leading manufacturer of high-quality uniforms based in Ichalkaranji, Maharashtra. 
              With over two decades of experience, we have established ourselves as a trusted name in the uniform 
              manufacturing industry.
            </p>
            <p>
              Our company specializes in producing a wide range of uniforms including hospital wear, school uniforms, 
              sportswear, hotel uniforms, industrial uniforms, and scout/guide/NCC outfits. We take pride in our 
              commitment to quality, timely delivery, and customer satisfaction.
            </p>
            <div className="about-features">
              <div className="about-feature">
                <CheckCircle size={20} />
                <span>Premium Quality Fabrics</span>
              </div>
              <div className="about-feature">
                <CheckCircle size={20} />
                <span>Customized Solutions</span>
              </div>
              <div className="about-feature">
                <CheckCircle size={20} />
                <span>Timely Delivery</span>
              </div>
              <div className="about-feature">
                <CheckCircle size={20} />
                <span>Competitive Pricing</span>
              </div>
            </div>
          </div>
        </div>

        <div className="about-mission-vision">
          <div className="mission-vision-card">
            <div className="mission-vision-icon">
              <Award size={40} />
            </div>
            <h3>Our Mission</h3>
            <p>
              To provide high-quality uniforms that meet the specific needs of our clients across various 
              industries while maintaining the highest standards of craftsmanship, customer service, and 
              value for money.
            </p>
          </div>
          <div className="mission-vision-card">
            <div className="mission-vision-icon">
              <Shirt size={40} />
            </div>
            <h3>Our Vision</h3>
            <p>
              To become the most trusted and preferred uniform manufacturer in India, known for our 
              quality products, innovative designs, and customer-centric approach.
            </p>
          </div>
          <div className="mission-vision-card">
            <div className="mission-vision-icon">
              <Clock size={40} />
            </div>
            <h3>Our History</h3>
            <p>
              Founded in 2005, Diamond Garment started as a small tailoring unit and has now grown into a 
              full-fledged uniform manufacturing company serving clients across various sectors throughout India.
            </p>
          </div>
        </div>

        <div className="about-process">
          <h2 className="process-title">Our Manufacturing Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="process-step-number">1</div>
              <h3>Material Selection</h3>
              <p>We select the finest fabrics suitable for each type of uniform considering comfort, durability, and purpose.</p>
            </div>
            <div className="process-step">
              <div className="process-step-number">2</div>
              <h3>Design & Pattern Making</h3>
              <p>Our skilled designers create patterns based on client specifications and industry standards.</p>
            </div>
            <div className="process-step">
              <div className="process-step-number">3</div>
              <h3>Cutting & Stitching</h3>
              <p>Expert tailors cut the fabric according to patterns and stitch them with precision.</p>
            </div>
            <div className="process-step">
              <div className="process-step-number">4</div>
              <h3>Quality Check</h3>
              <p>Each uniform goes through a rigorous quality check to ensure it meets our high standards.</p>
            </div>
            <div className="process-step">
              <div className="process-step-number">5</div>
              <h3>Packaging & Delivery</h3>
              <p>The uniforms are carefully packaged and delivered to the clients within the promised timeframe.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;