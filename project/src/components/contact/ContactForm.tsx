import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send } from 'lucide-react';
import { getApiUrl } from '../../config/api';
import './ContactForm.css';

const ContactForm: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
    message: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productParam = params.get('product');
    if (productParam) {
      setFormData(prev => ({ ...prev, product: productParam }));
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use the full URL to the backend server
      const response = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        alert('Thank you for your enquiry! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          product: '',
          message: '',
        });
      } else {
        alert('There was an error submitting your form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    }
  };

  return (
    <div className="contact-form-container">
      <h2>Send Us a Message</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="product">Product of Interest</label>
          <select
            id="product"
            name="product"
            value={formData.product}
            onChange={handleChange}
          >
            <option value="">Select a product</option>
            <option value="Hospital Wear">Hospital Wear</option>
            <option value="School Uniforms">School Uniforms</option>
            <option value="Sportswear">Sportswear</option>
            <option value="Hotel Uniforms">Hotel Uniforms</option>
            <option value="Industrial Uniforms">Industrial Uniforms</option>
            <option value="Scout & NCC Outfits">Scout & NCC Outfits</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Your Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn submit-btn">
          Send Message <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ContactForm;