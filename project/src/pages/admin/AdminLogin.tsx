import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Shield, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types/admin';
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

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    console.log('Login form submitted');
    
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

  if (authLoading) {
    return (
      <div className="admin-login-page">
        <div className="login-container">
          <div className="loading-state">
            <div className="loading-spinner">
              <Loader2 className="animate-spin" size={48} />
            </div>
            <div className="loading-content">
              <h3>Authenticating...</h3>
              <p>Please wait while we verify your session</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="login-background">
        <div className="background-pattern"></div>
        <div className="background-gradient"></div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="brand-section">
              <div className="brand-icon">
                <div className="diamond-icon">💎</div>
              </div>
              <div className="brand-info">
                <h1>Diamond Garment</h1>
                <p>Admin Portal</p>
              </div>
            </div>
            <div className="security-badge">
              <Shield size={16} />
              <span>Secure Login</span>
            </div>
          </div>

          <div className="login-content">
            <div className="welcome-section">
              <h2>Welcome Back</h2>
              <p>Sign in to access your admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail size={16} />
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    disabled={isLoading}
                  />
                  <div className="input-icon">
                    <Mail size={18} />
                  </div>
                </div>
                {errors.email && (
                  <span className="error-message">
                    <span className="error-icon">⚠</span>
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <Lock size={16} />
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    disabled={isLoading}
                  />
                  <div className="input-icon">
                    <Lock size={18} />
                  </div>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">
                    <span className="error-icon">⚠</span>
                    {errors.password.message}
                  </span>
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
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="login-footer">
            <div className="security-info">
              <Shield size={14} />
              <span>Your connection is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;