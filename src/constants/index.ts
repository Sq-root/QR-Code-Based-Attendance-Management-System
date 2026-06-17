export const APP_NAME = 'AksharAttend';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
} as const;

export const AUTH_KEYS = {
  TOKEN: 'auth_token',
  ROLE: 'auth_role',
  REMEMBER_USER: 'remember_user',
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/auth/login', // Hooked up to mock system now, ready to replace once real endpoint is live
} as const;
