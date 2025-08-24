import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { getApiUrl, API_BASE_URL } from '../../config/api';
import './ProductGrid.css';

interface Product {
  _id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  featured?: boolean;
}

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', 'Hospital', 'School', 'Sports', 'Hotel', 'Industrial', 'Scout & NCC'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiUrl = getApiUrl('/products');
        console.log('Fetching products from:', apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((product: Product) => product.category === activeCategory);

  return (
    <section className="product-grid-section">
      <div className="container">
        <div className="product-categories">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-message">Loading products...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-message">
            {activeCategory === 'All'
              ? 'No products found.'
              : `No products found in the ${activeCategory} category.`}
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product: Product) => (
              <div className="product-card" key={product._id}>
                <div className="product-image">
                  <img
                    src={product.image.startsWith('http') ? product.image : `${import.meta.env.PROD ? API_BASE_URL : 'http://localhost:5000'}${product.image}`}
                    alt={product.name}
                  />
                </div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-actions">
                    <Link
                      to={`/contact?product=${encodeURIComponent(product.name)}`}
                      className="btn"
                    >
                      Enquire Now
                    </Link>
                    <a href="tel:+917533455" className="btn btn-outline">
                      <Phone size={16} /> Call to Order
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;