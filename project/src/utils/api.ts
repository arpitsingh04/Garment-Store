import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  Product,
  GalleryItem,
  Testimonial,
  Contact,
  User
} from '../types/admin';
import { API_BASE_URL, getApiUrl, debugApiConfig } from '../config/api';

// Debug API configuration on load
debugApiConfig();

// Create axios instance with proper base URL
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    const baseUrl = API_BASE_URL || 'https://diamond-garment.onrender.com';
    return `${baseUrl}/api`;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  const sessionId = getSessionId();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (sessionId) {
    config.headers['X-Session-ID'] = sessionId;
  }

  // Log request in development
  if (!import.meta.env.PROD) {
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullUrl: `${config.baseURL}${config.url}`
    });
  }

  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (!import.meta.env.PROD) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      fullUrl: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown'
    });

    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page and not during login attempt
      const currentPath = window.location.hash;
      const isLoginPage = currentPath.includes('/admin/login');
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      
      if (!isLoginPage && !isLoginRequest) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_session_id');
        window.location.hash = '#/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Session management
export const generateSessionId = (): string => {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 1000000);
  return `session_${timestamp}_${randomPart}`;
};

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('admin_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('admin_session_id', sessionId);
  }
  return sessionId;
};

// Browser info
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown";

  if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Firefox";
  } else if (userAgent.indexOf("SamsungBrowser") > -1) {
    browserName = "Samsung Browser";
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    browserName = "Opera";
  } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
    browserName = "Edge";
  } else if (userAgent.indexOf("Chrome") > -1) {
    browserName = "Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    browserName = "Safari";
  }

  return {
    browser: browserName,
    userAgent: userAgent,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    language: navigator.language
  };
};

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const browserInfo = getBrowserInfo();
      console.log('Making login request with credentials:', {
        email: credentials.email,
        password: '[HIDDEN]',
        clientInfo: {
          browser: browserInfo.browser,
          screenSize: `${browserInfo.screenWidth}x${browserInfo.screenHeight}`,
          language: browserInfo.language
        }
      });

      const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', {
        ...credentials,
        clientInfo: {
          browser: browserInfo.browser,
          screenSize: `${browserInfo.screenWidth}x${browserInfo.screenHeight}`,
          language: browserInfo.language
        }
      });

      console.log('Login response received:', {
        success: response.data.success,
        hasToken: !!response.data.token,
        hasData: !!response.data.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_session_id');
    }
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/me');
    return response.data;
  },

  // Helper method to create admin (for initial setup)
  createAdmin: async (): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.post('/auth/create-admin');
    return response.data;
  },

  // Helper method to reset admin (emergency use)
  resetAdmin: async (): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.post('/auth/reset-admin');
    return response.data;
  }
};

// Products API
export const productsAPI = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    const response: AxiosResponse<ApiResponse<Product[]>> = await api.get('/products');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const response: AxiosResponse<ApiResponse<Product>> = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData: any): Promise<ApiResponse<Product>> => {
    const response: AxiosResponse<ApiResponse<Product>> = await api.post('/products', productData);
    return response.data;
  },

  update: async (id: string, productData: any): Promise<ApiResponse<Product>> => {
    const response: AxiosResponse<ApiResponse<Product>> = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/products/${id}`);
    return response.data;
  }
};

// Gallery API
export const galleryAPI = {
  getAll: async (): Promise<ApiResponse<GalleryItem[]>> => {
    const response: AxiosResponse<ApiResponse<GalleryItem[]>> = await api.get('/gallery');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<GalleryItem>> => {
    const response: AxiosResponse<ApiResponse<GalleryItem>> = await api.get(`/gallery/${id}`);
    return response.data;
  },

  create: async (galleryData: any): Promise<ApiResponse<GalleryItem>> => {
    const response: AxiosResponse<ApiResponse<GalleryItem>> = await api.post('/gallery', galleryData);
    return response.data;
  },

  update: async (id: string, galleryData: any): Promise<ApiResponse<GalleryItem>> => {
    const response: AxiosResponse<ApiResponse<GalleryItem>> = await api.put(`/gallery/${id}`, galleryData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/gallery/${id}`);
    return response.data;
  }
};

// Testimonials API
export const testimonialsAPI = {
  getAll: async (): Promise<ApiResponse<Testimonial[]>> => {
    const response: AxiosResponse<ApiResponse<Testimonial[]>> = await api.get('/testimonials/admin/all');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Testimonial>> => {
    const response: AxiosResponse<ApiResponse<Testimonial>> = await api.get(`/testimonials/${id}`);
    return response.data;
  },

  create: async (testimonialData: any): Promise<ApiResponse<Testimonial>> => {
    const response: AxiosResponse<ApiResponse<Testimonial>> = await api.post('/testimonials', testimonialData);
    return response.data;
  },

  update: async (id: string, testimonialData: any): Promise<ApiResponse<Testimonial>> => {
    const response: AxiosResponse<ApiResponse<Testimonial>> = await api.put(`/testimonials/${id}`, testimonialData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/testimonials/${id}`);
    return response.data;
  }
};

// Contacts API
export const contactsAPI = {
  getAll: async (): Promise<ApiResponse<Contact[]>> => {
    const response: AxiosResponse<ApiResponse<Contact[]>> = await api.get('/contact');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Contact>> => {
    const response: AxiosResponse<ApiResponse<Contact>> = await api.get(`/contact/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<Contact>> => {
    const response: AxiosResponse<ApiResponse<Contact>> = await api.put(`/contact/${id}`, { status });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/contact/${id}`);
    return response.data;
  }
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File): Promise<ApiResponse<{ filePath: string }>> => {
    const formData = new FormData();
    formData.append('image', file);

    const response: AxiosResponse<ApiResponse<{ filePath: string }>> = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default api;