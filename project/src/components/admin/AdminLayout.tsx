import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Package, 
  Images, 
  Star, 
  Mail, 
  LogOut,
  User,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'products', label: 'Products', icon: Package, path: '/admin/products' },
    { id: 'gallery', label: 'Gallery', icon: Images, path: '/admin/gallery' },
    { id: 'testimonials', label: 'Testimonials', icon: Star, path: '/admin/testimonials' },
    { id: 'contacts', label: 'Contact Submissions', icon: Mail, path: '/admin/contacts' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    document.body.style.overflow = '';
  };

  const openSidebar = () => {
    setSidebarOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-container">
            <div className="brand-icon">
              <div className="diamond-icon">💎</div>
            </div>
            <div className="brand-text">
              <h3>Diamond Garment</h3>
              <span>Admin Panel</span>
            </div>
          </div>
          <button 
            className="btn-close-sidebar md:hidden" 
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-section">
            <span className="menu-section-title">Navigation</span>
            <ul>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li 
                    key={item.id} 
                    className={`menu-item ${isActive ? 'active' : ''}`}
                    onClick={() => navigate(item.path)}
                  >
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <div className="menu-icon">
                        <Icon size={20} />
                      </div>
                      <span className="menu-label">{item.label}</span>
                      <ChevronRight size={16} className="menu-arrow" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="menu-section">
            <span className="menu-section-title">Account</span>
            <ul>
              <li className="menu-item logout-item" onClick={handleLogout}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <div className="menu-icon">
                    <LogOut size={20} />
                  </div>
                  <span className="menu-label">Logout</span>
                  <ChevronRight size={16} className="menu-arrow" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Admin User'}</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay active"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <button 
              className="btn-toggle-sidebar md:hidden"
              onClick={openSidebar}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            
            <div className="breadcrumb">
              <span className="breadcrumb-item">Admin</span>
              <ChevronRight size={16} className="breadcrumb-separator" />
              <span className="breadcrumb-item current">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </span>
            </div>
          </div>
          
          <div className="topbar-right">
            <div className="user-info">
              <div className="user-avatar-small">
                <User size={18} />
              </div>
              <span className="hidden sm:inline">{user?.name || 'Admin User'}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;