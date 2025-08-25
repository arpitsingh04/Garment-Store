import React, { useState, useEffect } from 'react';
import { Package, Images, Star, Mail, TrendingUp, Users, Activity, Calendar } from 'lucide-react';
import { Product, Contact, DashboardStats } from '../../types/admin';
import { productsAPI, galleryAPI, testimonialsAPI, contactsAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    productCount: 0,
    galleryCount: 0,
    testimonialCount: 0,
    contactCount: 0,
    recentProducts: [],
    recentContacts: []
  });
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [productsRes, galleryRes, testimonialsRes, contactsRes] = await Promise.all([
        productsAPI.getAll(),
        galleryAPI.getAll(),
        testimonialsAPI.getAll(),
        contactsAPI.getAll()
      ]);

      const newStats: DashboardStats = {
        productCount: productsRes.count || 0,
        galleryCount: galleryRes.count || 0,
        testimonialCount: testimonialsRes.count || 0,
        contactCount: contactsRes.count || 0,
        recentProducts: productsRes.data?.slice(0, 5) || [],
        recentContacts: contactsRes.data?.slice(0, 5) || []
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      count: stats.productCount,
      icon: Package,
      color: 'blue',
      trend: '+12%',
      description: 'Active products in catalog'
    },
    {
      title: 'Gallery Items',
      count: stats.galleryCount,
      icon: Images,
      color: 'green',
      trend: '+8%',
      description: 'Images in gallery'
    },
    {
      title: 'Testimonials',
      count: stats.testimonialCount,
      icon: Star,
      color: 'purple',
      trend: '+15%',
      description: 'Customer reviews'
    },
    {
      title: 'Contact Inquiries',
      count: stats.contactCount,
      icon: Mail,
      color: 'red',
      trend: '+23%',
      description: 'New inquiries this month'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-content">
            <h3>Loading Dashboard</h3>
            <p>Fetching your latest data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <Activity className="title-icon" size={32} />
            Dashboard Overview
          </h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="header-actions">
          <div className="date-info">
            <Calendar size={20} />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`stat-card ${card.color}`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card-background"></div>
              <div className="stat-header">
                <div className="stat-icon">
                  <Icon size={24} />
                </div>
                <div className="stat-trend">
                  <TrendingUp size={16} />
                  <span>{card.trend}</span>
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{card.count}</h3>
                <p className="stat-title">{card.title}</p>
                <span className="stat-description">{card.description}</span>
              </div>
              <div className="stat-footer">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(card.count * 10, 100)}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Data Section */}
      <div className="recent-data-section">
        <div className="section-header">
          <h2 className="section-title">
            <Users size={24} />
            Recent Activity
          </h2>
          <p className="section-subtitle">Latest updates from your business</p>
        </div>

        <div className="recent-data-grid">
          {/* Recent Products */}
          <div className="data-card">
            <div className="card-header">
              <div className="header-left">
                <Package size={20} />
                <h3>Recent Products</h3>
              </div>
              <div className="header-badge">
                {stats.recentProducts.length} items
              </div>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Date Added</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentProducts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="no-data">
                          <div className="empty-state">
                            <Package size={48} />
                            <p>No products found</p>
                            <span>Start by adding your first product</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      stats.recentProducts.map((product, index) => (
                        <tr key={product._id} style={{ animationDelay: `${index * 0.1}s` }}>
                          <td>
                            <div className="product-info">
                              <div className="product-avatar">
                                {product.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="product-name">{product.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="category-badge">{product.category}</span>
                          </td>
                          <td className="date-cell">{formatDate(product.createdAt)}</td>
                          <td>
                            <span className="status-badge active">Active</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Contacts */}
          <div className="data-card">
            <div className="card-header">
              <div className="header-left">
                <Mail size={20} />
                <h3>Recent Contacts</h3>
              </div>
              <div className="header-badge">
                {stats.recentContacts.length} inquiries
              </div>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentContacts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="no-data">
                          <div className="empty-state">
                            <Mail size={48} />
                            <p>No contacts found</p>
                            <span>Customer inquiries will appear here</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      stats.recentContacts.map((contact, index) => (
                        <tr key={contact._id} style={{ animationDelay: `${index * 0.1}s` }}>
                          <td>
                            <div className="contact-info">
                              <div className="contact-avatar">
                                {contact.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="contact-name">{contact.name}</span>
                            </div>
                          </td>
                          <td className="product-cell">
                            {contact.product ? (
                              <span className="product-tag">{contact.product}</span>
                            ) : (
                              <span className="no-product">General Inquiry</span>
                            )}
                          </td>
                          <td className="date-cell">{formatDate(contact.createdAt)}</td>
                          <td>
                            <span className={`status-badge ${contact.status}`}>
                              {contact.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;