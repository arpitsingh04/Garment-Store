import React, { useState, useEffect } from 'react';
import { Package, Images, Star, Mail } from 'lucide-react';
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
      title: 'Products',
      count: stats.productCount,
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Gallery Items',
      count: stats.galleryCount,
      icon: Images,
      color: 'green'
    },
    {
      title: 'Testimonials',
      count: stats.testimonialCount,
      icon: Star,
      color: 'purple'
    },
    {
      title: 'Contact Submissions',
      count: stats.contactCount,
      icon: Mail,
      color: 'red'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`stat-card ${card.color}`}>
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-details">
                <h3>{card.count}</h3>
                <p>{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Data Tables */}
      <div className="recent-data-grid">
        {/* Recent Products */}
        <div className="data-card">
          <div className="card-header">
            <h5>Recent Products</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Date Added</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentProducts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="no-data">No products found</td>
                    </tr>
                  ) : (
                    stats.recentProducts.map((product) => (
                      <tr key={product._id}>
                        <td className="truncate">{product.name}</td>
                        <td>{product.category}</td>
                        <td>{formatDate(product.createdAt)}</td>
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
            <h5>Recent Contacts</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Product</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentContacts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="no-data">No contacts found</td>
                    </tr>
                  ) : (
                    stats.recentContacts.map((contact) => (
                      <tr key={contact._id}>
                        <td className="truncate">{contact.name}</td>
                        <td className="truncate">{contact.product || 'N/A'}</td>
                        <td>{formatDate(contact.createdAt)}</td>
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
  );
};

export default AdminDashboard;
