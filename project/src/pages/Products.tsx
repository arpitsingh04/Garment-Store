import React from 'react';
import ProductGrid from '../components/products/ProductGrid';
import CTASection from '../components/common/CTASection';
import './Products.css';

const Products: React.FC = () => {
  return (
    <main className="products-page">
      <div className="page-header">
        <div className="container">
          <h1>Our Products</h1>
          <p>Explore our wide range of high-quality uniforms for various industries.</p>
        </div>
      </div>
      <ProductGrid />
      <CTASection />
    </main>
  );
};

export default Products;
