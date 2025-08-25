import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { getApiUrl } from '../../config/api';
import './InteractiveContactForm.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const InteractiveContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string>('');

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return value && !phoneRegex.test(value) ? 'Please enter a valid phone number' : '';
      case 'subject':
        return value.length < 3 ? 'Subject must be at least 3 characters' : '';
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setErrors({});
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'name': return <User size={20} />;
      case 'email': return <Mail size={20} />;
      case 'phone': return <Phone size={20} />;
      case 'subject': return <MessageSquare size={20} />;
      default: return null;
    }
  };

  const isFieldValid = (fieldName: string) => {
    return formData[fieldName as keyof FormData] && !errors[fieldName];
  };

  if (isSubmitted) {
    return (
      <div className="form-success">
        <div className="success-icon">
          <CheckCircle size={64} />
        </div>
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for contacting us. We'll get back to you soon.</p>
        <button 
          className="btn"
          onClick={() => setIsSubmitted(false)}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="interactive-contact-form">
      <div className="form-header">
        <h3>Get in Touch</h3>
        <p>Send us a message and we'll respond as soon as possible</p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className={`form-group full-width ${focusedField === 'name' ? 'focused' : ''} ${isFieldValid('name') ? 'valid' : ''}`}>
          <div className="input-wrapper">
            <div className="input-icon">
              {getFieldIcon('name')}
            </div> 
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField('')}
              placeholder="Your Name *"
              required
            />
            {isFieldValid('name') && (
              <div className="validation-icon">
                <CheckCircle size={16} />
              </div>
            )}
          </div>
          {errors.name && (
            <div className="error-message">
              <AlertCircle size={14} />
              {errors.name}
            </div>
          )}
        </div>

        <div className={`form-group full-width ${focusedField === 'email' ? 'focused' : ''} ${isFieldValid('email') ? 'valid' : ''}`}>
          <div className="input-wrapper">
            <div className="input-icon">
              {getFieldIcon('email')}
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
              placeholder="Your Email *"
              required
            />
            {isFieldValid('email') && (
              <div className="validation-icon">
                <CheckCircle size={16} />
              </div>
            )}
          </div>
          {errors.email && (
            <div className="error-message">
              <AlertCircle size={14} />
              {errors.email}
            </div>
          )}
        </div>

        <div className={`form-group full-width ${focusedField === 'phone' ? 'focused' : ''} ${isFieldValid('phone') ? 'valid' : ''}`}>
          <div className="input-wrapper">
            <div className="input-icon">
              {getFieldIcon('phone')}
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField('')}
              placeholder="Your Phone (Optional)"
            />
            {isFieldValid('phone') && (
              <div className="validation-icon">
                <CheckCircle size={16} />
              </div>
            )}
          </div>
          {errors.phone && (
            <div className="error-message">
              <AlertCircle size={14} />
              {errors.phone}
            </div>
          )}
        </div>

        <div className={`form-group full-width ${focusedField === 'subject' ? 'focused' : ''} ${isFieldValid('subject') ? 'valid' : ''}`}>
          <div className="input-wrapper">
            <div className="input-icon">
              {getFieldIcon('subject')}
            </div>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('subject')}
              onBlur={() => setFocusedField('')}
              placeholder="Subject *"
              required
            />
            {isFieldValid('subject') && (
              <div className="validation-icon">
                <CheckCircle size={16} />
              </div>
            )}
          </div>
          {errors.subject && (
            <div className="error-message">
              <AlertCircle size={14} />
              {errors.subject}
            </div>
          )}
        </div>

        <div className={`form-group full-width ${focusedField === 'message' ? 'focused' : ''} ${isFieldValid('message') ? 'valid' : ''}`}>
          <div className="textarea-wrapper">
            
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField('')}
              placeholder="Your Message *"
              rows={5}
              required
            />
            {isFieldValid('message') && (
              <div className="validation-icon">
                <CheckCircle size={16} />
              </div>
            )}
          </div>
          {errors.message && (
            <div className="error-message">
              <AlertCircle size={14} />
              {errors.message}
            </div>
          )}
        </div>

        {errors.submit && (
          <div className="error-message submit-error">
            <AlertCircle size={16} />
            {errors.submit}
          </div>
        )}

        <button 
          type="submit" 
          className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="spinner"></div>
              Sending...
            </>
          ) : (
            <>
              <Send size={20} />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InteractiveContactForm;
