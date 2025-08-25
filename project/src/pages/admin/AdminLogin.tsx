import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types/admin';
import { authAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminLogin.css';

interface LoginFormData {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<LoginFormData>();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    console.log('Login form submitted with:', { email: data.email, password: '[HIDDEN]' });
    
    try {
      const success = await login(data as LoginCredentials);
      if (success) {
        console.log('Login successful, navigating to dashboard');
        navigate('/admin', { replace: true });
      }
    } catch (error) {
      console.error('Login submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    setIsCreatingAdmin(true);
    try {
      console.log('Creating admin account...');
      const response = await authAPI.createAdmin();
      if (response.success) {
        toast.success('Admin account created successfully!');
        // Auto-fill the form with default credentials
        setValue('email', 'admin@diamondgarment.com');
        setValue('password', 'admin123');
      } else {
        toast.error(response.message || 'Failed to create admin account');
      }
    } catch (error: any) {
      console.error('Admin creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create admin account');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleResetAdmin = async () => {
    if (!confirm('Are you sure you want to reset the admin account? This will delete all existing admin users.')) {
      return;
    }

    setIsCreatingAdmin(true);
    try {
      console.log('Resetting admin account...');
      const response = await authAPI.resetAdmin();
      if (response.success) {
        toast.success('Admin account reset successfully!');
        // Auto-fill the form with default credentials
        setValue('email', 'admin@diamondgarment.com');
        setValue('password', 'admin123');
      } else {
        toast.error(response.message || 'Failed to reset admin account');
      }
    } catch (error: any) {
      console.error('Admin reset error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset admin account');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  if (authLoading) {
    return (
      <div className="admin-login-page">
        <div className="login-container">
          <div className="loading-spinner">
            <Loader2 className="animate-spin" size={40} />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-form">
          <div className="login-header">
            <h2>Diamond Garment</h2>
            <p>Admin Panel Login</p>
            
            {/* Development/Debug Info */}
            <div style={{ 
              background: '#f0f8ff', 
              padding: '10px', 
              borderRadius: '4px', 
              fontSize: '12px',
              marginTop: '10px',
              border: '1px solid #ccc'
            }}>
              <strong>Default Admin Credentials:</strong><br/>
              Email: admin@diamondgarment.com<br/>
              Password: admin123
            </div>

            {/* Admin Management Buttons */}
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleCreateAdmin}
                disabled={isCreatingAdmin}
                style={{
                  padding: '5px 10px',
                  fontSize: '12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {isCreatingAdmin ? 'Creating...' : 'Create Admin'}
              </button>
              
              <button
                type="button"
                onClick={handleResetAdmin}
                disabled={isCreatingAdmin}
                style={{
                  padding: '5px 10px',
                  fontSize: '12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {isCreatingAdmin ? 'Resetting...' : 'Reset Admin'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form-content">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                disabled={isLoading}
                placeholder="admin@diamondgarment.com"
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`form-control ${errors.password ? 'error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  disabled={isLoading}
                  placeholder="admin123"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;