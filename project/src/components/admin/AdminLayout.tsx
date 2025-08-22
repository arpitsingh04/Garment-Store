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
  User
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
          <h3>Diamond Garment</h3>
          <button 
            className="btn-close-sidebar md:hidden" 
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="sidebar-menu">
          <ul>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li 
                  key={item.id} 
                  className={isActive ? 'active' : ''}
                  onClick={() => navigate(item.path)}
                >
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
            
            <li onClick={handleLogout} className="logout-item">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <LogOut size={20} />
                <span>Logout</span>
              </a>
            </li>
          </ul>
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
          <button 
            className="btn-toggle-sidebar md:hidden"
            onClick={openSidebar}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          
          <div className="user-info">
            <span className="hidden sm:inline">{user?.name || 'Admin User'}</span>
            <div className="user-avatar">
              <User size={24} />
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
