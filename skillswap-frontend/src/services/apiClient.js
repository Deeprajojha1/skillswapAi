import axios from 'axios';
import { normalizeError } from './errorHandler.js';
import { ROLE_STORAGE_KEY } from '../lib/constants.js';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  // There's no login — the backend resolves a demo user per role from this
  // header (see requireAuth in skillswap-backend/src/middlewares/auth.middleware.js).
  // The active role is whatever the Client/Creator switch in Navbar/MobileNav
  // last wrote to localStorage.
  config.headers['x-skillswap-role'] = localStorage.getItem(ROLE_STORAGE_KEY) || 'client';

  // Multipart uploads (gig image) must let the browser set their own
  // Content-Type with the correct boundary.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    error.normalized = normalizeError(error);
    return Promise.reject(error);
  },
);

export default apiClient;
