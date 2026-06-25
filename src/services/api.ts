import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, AUTH_KEYS } from '../constants';

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

    // Console logging request interceptor for development visibility
    console.log(`[API Request Interceptor] Sending to: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('[API Request Interceptor Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Format errors, log responses, handle session expiration
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Console logging successful response interceptor for visibility
    console.log(`[API Response Interceptor] Success: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API Response Interceptor Error] Failed request details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });

    // Example: Global status code handling (e.g., unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized. Redirecting to login...');
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
