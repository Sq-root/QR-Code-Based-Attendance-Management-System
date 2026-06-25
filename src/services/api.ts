import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, AUTH_KEYS } from '../constants';
import { logger } from '../lib/logger';

// Create a custom Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': true,
  },
});

// Request Interceptor: Attach authentication token, log requests, etc.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Retrieve token from localStorage
    const token = localStorage.getItem(AUTH_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    logger.info(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    return config;
  },
  (error) => {
    logger.error('[API Request Interceptor Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Format errors, log responses, handle session expiration
api.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.info(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    logger.error('[API Response Error]', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });

    // Example: Global status code handling (e.g., unauthorized)
    if (error.response && error.response.status === 401) {
      logger.warn('Session expired or unauthorized. Redirecting to login...');
      // Perform redirect or log out actions if needed
    }

    // Normalize error shape before sending to caller
    const normalizedError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred.',
      status: error.response?.status,
    };

    return Promise.reject(normalizedError);
  }
);

export default api;
