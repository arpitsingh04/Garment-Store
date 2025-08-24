// API Configuration for different environments
const getApiBaseUrl = (): string => {
  // In production, use the deployed backend URL
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || 'https://your-backend-app.onrender.com';
  }
  
  // In development, use the proxy or localhost
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to construct full API URLs
export const getApiUrl = (endpoint: string): string => {
  if (endpoint.startsWith('http')) {
    return endpoint; // Already a full URL
  }
  
  // Always use full URL in production (shared hosting)
  if (import.meta.env.PROD) {
    const baseUrl = API_BASE_URL || 'https://your-backend-app.onrender.com';
    return `${baseUrl}${endpoint.startsWith('/api') ? endpoint : `/api/${endpoint.replace(/^\//, '')}`}`;
  }
  
  // In development, use proxy
  return endpoint.startsWith('/api') ? endpoint : `/api/${endpoint.replace(/^\//, '')}`;
};

export default {
  API_BASE_URL,
  getApiUrl
};