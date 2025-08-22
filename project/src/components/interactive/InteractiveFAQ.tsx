import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import './InteractiveFAQ.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const InteractiveFAQ: React.FC = () => {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "What types of uniforms do you manufacture?",
      answer: "We specialize in manufacturing high-quality uniforms for various industries including hospitals, schools, hotels, industrial sectors, sports teams, and Scout & NCC organizations. Each uniform is tailored to meet specific industry requirements and standards."
    },
    {
      id: 2,
      question: "What is your minimum order quantity?",
      answer: "Our minimum order quantity varies depending on the type of uniform and customization requirements. For standard designs, we typically require a minimum of 50 pieces, while custom designs may have different minimums. Please contact us for specific requirements."
    },
    {
      id: 3,
      question: "How long does it take to complete an order?",
      answer: "Production time depends on the order size and complexity. Standard orders typically take 2-3 weeks, while custom designs may require 3-4 weeks. We also offer rush orders for urgent requirements with additional charges."
    },
    {
      id: 4,
      question: "Do you provide customization services?",
      answer: "Yes, we offer comprehensive customization services including embroidery, screen printing, logo placement, color matching, and size adjustments. Our design team works closely with clients to ensure their specific requirements are met."
    },
    {
      id: 5,
      question: "What materials do you use for your uniforms?",
      answer: "We use high-quality, durable fabrics suitable for each industry. This includes cotton blends, polyester, antimicrobial fabrics for healthcare, flame-resistant materials for industrial use, and breathable fabrics for sports uniforms."
    },
    {
      id: 6,
      question: "Do you offer bulk discounts?",
      answer: "Yes, we offer competitive bulk pricing for large orders. The discount percentage increases with order quantity. We also provide special rates for repeat customers and long-term contracts."
    }
  ];

  const toggleItem = (id: number) => {
    setActiveItem(activeItem === id ? null : id);
  };

  return (
    <section className="interactive-faq-section">
      <div className="container">
        <div className="faq-header">
          <div className="faq-icon">
            <HelpCircle size={48} />
          </div>
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common questions about our services and products</p>
        </div>

        <div className="faq-container">
          {faqData.map((item) => (
            <div
              key={item.id}
              className={`faq-item ${activeItem === item.id ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleItem(item.id)}
                aria-expanded={activeItem === item.id}
              >
                <span>{item.question}</span>
                <div className="faq-icon-toggle">
                  {activeItem === item.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </button>

              <div className="faq-answer">
                <div className="faq-answer-content">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveFAQ;
