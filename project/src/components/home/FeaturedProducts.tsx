import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './FeaturedProducts.css';

interface Product {
  _id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  featured: boolean;
}

// Fallback data in case API fails
const fallbackProducts = [
  {
    _id: '1',
    name: 'Hospital Wear',
    image: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Hospital',
    description: 'High-quality medical uniforms, scrubs, and protective wear for healthcare professionals.',
    featured: true
  },
  {
    _id: '2',
    name: 'School Uniforms',
    image: 'https://images.pexels.com/photos/764681/pexels-photo-764681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'School',
    description: 'Comfortable and durable school uniforms for students of all ages.',
    featured: true
  },
  {
    _id: '3',
    name: 'Industrial Uniforms',
    image: 'https://images.pexels.com/photos/8837141/pexels-photo-8837141.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Industrial',
    description: 'Safe and durable workwear for various industrial environments.',
    featured: true
  }
];

const FeaturedProducts: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products?featured=true');

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data.length > 0) {
          setFeaturedProducts(data.data);
        } else {
          // If no featured products found, use fallback data
          setFeaturedProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(true);
        // Use fallback data on error
        setFeaturedProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Display at most 3 featured products
  const displayProducts = featuredProducts.slice(0, 3);

  return (
    <section className="featured-products-section">
      <div className="container">
        <h2 className="section-title">Our Featured Products</h2>
        <div className="featured-products">
          {loading ? (
            <div className="loading-message">Loading featured products...</div>
          ) : displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <div className="product-category-card" key={product._id}>
                <div className="product-category-image">
                  <img
                    src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                    alt={product.name}
                  />
                </div>
                <div className="product-category-content">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <Link to={`/products`} className="product-category-link">
                    View Details <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-message">No featured products available.</div>
          )}
        </div>
        <div className="view-all-container">
          <Link to="/products" className="btn">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;