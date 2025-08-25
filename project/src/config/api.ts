// API Configuration for different environments
const getApiBaseUrl = (): string => {
  // In production, use the deployed backend URL
  if (import.meta.env.PROD) {
    // Use environment variable or fallback to your Render URL
    return import.meta.env.VITE_API_BASE_URL || 'https://diamond-garment.onrender.com';
  }
  
  // In development, use empty string to rely on proxy
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to construct full API URLs
export const getApiUrl = (endpoint: string): string => {
  if (endpoint.startsWith('http')) {
    return endpoint; // Already a full URL
  }
  
  // In production (shared hosting), always use full URL
  if (import.meta.env.PROD) {
    const baseUrl = API_BASE_URL || 'https://diamond-garment.onrender.com';
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.replace(/^\//, '');
    
    // Ensure /api is included
    if (cleanEndpoint.startsWith('api/')) {
      return `${baseUrl}/${cleanEndpoint}`;
    } else {
      return `${baseUrl}/api/${cleanEndpoint}`;
    }
  }
  
  // In development, use proxy
  return endpoint.startsWith('/api') ? endpoint : `/api/${endpoint.replace(/^\//, '')}`;
};

// Debug function to log API configuration
export const debugApiConfig = () => {
  console.log('API Configuration:', {
    environment: import.meta.env.PROD ? 'production' : 'development',
    baseUrl: API_BASE_URL,
    envVar: import.meta.env.VITE_API_BASE_URL,
    sampleUrl: getApiUrl('auth/login')
  });
};

export default {
  API_BASE_URL,
  getApiUrl,
  debugApiConfig
};