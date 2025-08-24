import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneIcon, MailIcon, MapPinIcon, FacebookIcon, InstagramIcon, LinkedinIcon } from './Icons';
import './Footer.css';
import logo from '../../assets/images/logofav.png';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-info">
          <div className="footer-logo">
            <img src={logo} alt="Diamond Garment Logo" />
            <div className="footer-logo-text">
              <h3>Diamond Garment</h3>
              {/* <p>Manufacturer</p> */}
            </div>
          </div>
          <p>
            Diamond Garment specializes in manufacturing high-quality uniforms for various sectors including healthcare, education, hospitality, industrial, and more.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FacebookIcon size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <LinkedinIcon size={20} />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-products">
          <h3>Our Products</h3>
          <ul>
            <li><Link to="/products">Hospital Wear</Link></li>
            <li><Link to="/products">School Uniforms</Link></li>
            <li><Link to="/products">Sportswear</Link></li>
            <li><Link to="/products">Hotel Uniforms</Link></li>
            <li><Link to="/products">Industrial Uniforms</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <ul>
            <li>
              <MapPinIcon size={18} />
              <span>18/888/2 Jawahar Nagar, Near Postoffice, Station Road, Ichalkaranji, Maharashtra - 416115</span>
            </li>
            <li>
              <PhoneIcon size={18} />
              <span>+91 75334 556 / +91 70204 60115</span>
            </li>
            <li>
              <MailIcon size={18} />
              <span>diamondgarment115@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Diamond Garment. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
