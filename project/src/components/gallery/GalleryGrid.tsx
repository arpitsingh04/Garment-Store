import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Filter, Grid, Eye, Heart, Share2, Download, Camera } from 'lucide-react';
import { getApiUrl, API_BASE_URL } from '../../config/api';
import './GalleryGrid.css';

interface GalleryItem {
  _id: string;
  image: string;
  title: string;
  category: string;
}

const GalleryGrid: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const masonryRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Hospital', 'School', 'Sports', 'Hotel', 'Industrial', 'Scout & NCC'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const apiUrl = getApiUrl('/gallery');
        console.log('Fetching gallery from:', apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // Randomize the order slightly for a more natural masonry look
          const shuffled = [...data.data].sort(() => 0.5 - Math.random());
          setGalleryItems(shuffled);
        } else {
          setError('Failed to fetch gallery items');
        }
      } catch (err) {
        console.error('Error fetching gallery items:', err);
        setError('Failed to fetch gallery items');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const filteredGallery = galleryItems
    .filter(item => activeCategory === 'All' || item.category === activeCategory)
    .filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const toggleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const shareImage = (item: GalleryItem) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out this ${item.category} uniform: ${item.title}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const openLightbox = (item: GalleryItem) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // Touch gesture handling for lightbox
  const handleTouchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleTouchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!handleTouchStart.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - handleTouchStart.current.x;
    const deltaY = touch.clientY - handleTouchStart.current.y;

    // If the swipe is primarily vertical and downward, close the lightbox
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 50) {
      closeLightbox();
    }

    handleTouchStart.current = null;
  };

  const handleImageLoad = (id: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Function to get a random height class for Pinterest-style variation
  const getRandomHeightClass = (id: string) => {
    // Use the id to ensure consistent heights for the same items
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const heightClasses = ['short', 'medium', 'tall'];
    return heightClasses[hash % heightClasses.length];
  };

  return (
    <section className="gallery-section" ref={sectionRef}>
      <div className="container">
        <div className="gallery-header">
          <div className="header-badge">
            <Camera size={20} />
            <span>Our Gallery</span>
          </div>
          <h2>Uniform Collection Showcase</h2>
          <p>Explore our diverse range of high-quality uniforms across various industries and sectors</p>
        </div>

        <div className="gallery-controls">
          <div className="search-filter-section">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search uniforms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'masonry' ? 'active' : ''}`}
                onClick={() => setViewMode('masonry')}
              >
                <Filter size={18} />
                Masonry
              </button>
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
                Grid
              </button>
            </div>
          </div>

          <div className="gallery-categories">
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
        </div>

        {loading ? (
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <p>Loading amazing uniforms...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredGallery.length === 0 ? (
          <div className="empty-message">
            <Camera size={48} />
            <h3>No uniforms found</h3>
            <p>
              {searchTerm
                ? `No results for "${searchTerm}". Try a different search term.`
                : activeCategory === 'All'
                ? 'No gallery items available at the moment.'
                : `No uniforms found in the ${activeCategory} category.`}
            </p>
          </div>
        ) : (
          <div className={`gallery-grid ${viewMode} ${isVisible ? 'animate' : ''}`} ref={masonryRef}>
            {filteredGallery.map((item, index) => (
              <div
                className={`gallery-item ${getRandomHeightClass(item._id)} ${hoveredItem === item._id ? 'hovered' : ''}`}
                key={item._id}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredItem(item._id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="gallery-image">
                  <img
                    src={item.image.startsWith('http') ? item.image : `${import.meta.env.PROD ? API_BASE_URL : 'http://localhost:5000'}${item.image}`}
                    alt={item.title}
                    onLoad={() => handleImageLoad(item._id)}
                    loading="lazy"
                  />
                  <div className="image-overlay"></div>
                </div>

                <div className="gallery-overlay">
                  <div className="overlay-content">
                    <h3>{item.title}</h3>
                    <p>{item.category}</p>
                  </div>

                  <div className="gallery-actions">
                    <button
                      className="action-btn view-btn-action"
                      onClick={() => openLightbox(item)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className={`action-btn like-btn ${likedItems.has(item._id) ? 'liked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(item._id);
                      }}
                    >
                      <Heart size={16} />
                    </button>
                    <button
                      className="action-btn share-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        shareImage(item);
                      }}
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="gallery-progress">
                  <div className="progress-bar" style={{ width: isVisible ? '100%' : '0%' }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedImage && (
          <div
            className="lightbox"
            onClick={closeLightbox}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="lightbox-header">
              <div className="lightbox-actions">
                <button
                  className={`lightbox-action-btn like-btn ${likedItems.has(selectedImage._id) ? 'liked' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(selectedImage._id);
                  }}
                >
                  <Heart size={20} />
                </button>
                <button
                  className="lightbox-action-btn share-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    shareImage(selectedImage);
                  }}
                >
                  <Share2 size={20} />
                </button>
                <button
                  className="lightbox-action-btn download-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Download functionality
                    const link = document.createElement('a');
                    link.href = selectedImage.image.startsWith('http')
                      ? selectedImage.image
                      : `${import.meta.env.PROD ? API_BASE_URL : 'http://localhost:5000'}${selectedImage.image}`;
                    link.download = selectedImage.title;
                    link.click();
                  }}
                >
                  <Download size={20} />
                </button>
              </div>
              <button className="close-lightbox" onClick={closeLightbox} aria-label="Close">
                <X size={24} />
              </button>
            </div>

            <div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div className="lightbox-image-container">
                <img
                  src={selectedImage.image.startsWith('http')
                    ? selectedImage.image
                    : `${import.meta.env.PROD ? API_BASE_URL : 'http://localhost:5000'}${selectedImage.image}`}
                  alt={selectedImage.title}
                  loading="eager"
                />
              </div>
              <div className="lightbox-caption">
                <div className="caption-content">
                  <h3>{selectedImage.title}</h3>
                  <p>Category: {selectedImage.category}</p>
                </div>
                <div className="caption-badge">
                  <Eye size={16} />
                  <span>Premium Quality</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GalleryGrid;