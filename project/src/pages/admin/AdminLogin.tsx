import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types/admin';
import './AdminLogin.css';

interface LoginFormData {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Test API connection on component mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const apiUrl = import.meta.env.PROD 
          ? 'https://diamond-garment.onrender.com/api/auth/test' 
          : '/api/auth/test';
        console.log('Testing API connection to:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('API test response status:', response.status);
        console.log('API test response headers:', response.headers);
        
        if (response.ok) {
          const data = await response.text();
          console.log('API test response data:', data);
        } else {
          console.log('API test failed with status:', response.status);
        }
      } catch (error) {
        console.error('API test error:', error);
      }
    };

    testApiConnection();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    const credentials: LoginCredentials = {
      email: data.email,
      password: data.password
    };

    try {
      console.log('AdminLogin: Attempting login with credentials:', { email: data.email });
      const success = await login(credentials);
      console.log('AdminLogin: Login result:', success);
      
      if (success) {
        console.log('AdminLogin: Login successful, navigating to /admin');
        navigate('/admin');
      } else {
        console.log('AdminLogin: Login failed');
        setError('root', {
          type: 'manual',
          message: 'Invalid email or password'
        });
      }
    } catch (error) {
      console.error('AdminLogin: Login error:', error);
      setError('root', {
        type: 'manual',
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-form">
          <div className="login-header">
            <h2>Diamond Garment</h2>
            <p>Admin Panel Login</p>
            {import.meta.env.DEV && (
              <div style={{ 
                background: '#f0f8ff', 
                padding: '10px', 
                borderRadius: '4px', 
                fontSize: '12px',
                marginTop: '10px',
                border: '1px solid #ccc'
              }}>
                <strong>Development Mode - Default Admin Credentials:</strong><br/>
                Email: admin@diamondgarment.com<br/>
                Password: admin123
              </div>
            )}
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
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            {errors.root && (
              <div className="alert alert-error">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-login"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
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
