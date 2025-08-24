import React from 'react';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from '../common/Icons';
import './ContactInfo.css';

const ContactInfo: React.FC = () => {
  return (
    <div className="contact-info-container">
      <h2>Contact Information</h2>

      <div className="contact-item">
        <div className="contact-icon">
          <MapPinIcon size={24} />
        </div>
        <div className="contact-text">
          <h3>Address</h3>
          <p>18/888/2 Jawahar Nagar, Near Postoffice, Station Road, Ichalkaranji, Maharashtra - 416115</p>
        </div>
      </div>

      <div className="contact-item">
        <div className="contact-icon">
          <PhoneIcon size={24} />
        </div>
        <div className="contact-text">
          <h3>Phone</h3>
          <p><a href="tel:+91917533455">+91 9175334 556</a></p>
          <p><a href="tel:+917020460115">+91 70204 60115</a></p>
        </div>
      </div>

      <div className="contact-item">
        <div className="contact-icon">
          <MailIcon size={24} />
        </div>
        <div className="contact-text">
          <h3>Email</h3>
          <p><a href="mailto:diamondgarments115@gmail.com">diamondgarments115@gmail.com</a></p>
        </div>
      </div>

      <div className="contact-item">
        <div className="contact-icon">
          <ClockIcon size={24} />
        </div>
        <div className="contact-text">
          <h3>Business Hours</h3>
          <p>Monday - Sunday : 9:00 AM - 7:00 PM</p>
          
        </div>
      </div>

      <div className="google-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1910.7392837778486!2d74.45374965534052!3d16.702956696462394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc11d822a973183%3A0x99b8f38e6dc35284!2sJawahar%20Nagar%20Post%20office!5e0!3m2!1sen!2sin!4v1756042364105!5m2!1sen!2sin"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Diamond Garment Location"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactInfo;