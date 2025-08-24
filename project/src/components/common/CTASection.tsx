import React from 'react';
import { Link } from 'react-router-dom';
import './CTASection.css';
import { PhoneIcon } from './Icons';

const CTASection: React.FC = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Place a Bulk Order?</h2>
          <p>Get high-quality uniforms customized for your specific requirements with competitive pricing.</p>
          <Link to="/contact" className="btn cta-button">
            Place Bulk Order
          </Link>
           <Link to="tel:+917020460115" className="btn btn-call">
                    <PhoneIcon size={16} /> Call to Order
                  </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;