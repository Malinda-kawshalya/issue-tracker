// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api');

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  ISSUES: `${API_BASE_URL}/issues`,
  AUTH: `${API_BASE_URL}/auth`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROFILE: `${API_BASE_URL}/auth/profile`
};

export default API_ENDPOINTS;
