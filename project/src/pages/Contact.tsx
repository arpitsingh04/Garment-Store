import React from 'react';
import InteractiveContactForm from '../components/interactive/InteractiveContactForm';
import ContactInfo from '../components/contact/ContactInfo';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <main className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with us for any enquiries or to place an order</p>
        </div>
      </div>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form-section">
              <InteractiveContactForm />
            </div>
            <div className="contact-info-section">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;