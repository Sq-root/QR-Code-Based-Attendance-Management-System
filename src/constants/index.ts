export const APP_NAME = 'AksharAttend';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';
export const WAHA_BASE_URL = import.meta.env.VITE_WAHA_URL || 'http://localhost:3000';
export const EVENT_SESSION_ID = import.meta.env.VITE_EVENT_SESSION_ID || '';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  NEW_ATTENDEE: '/attendees/new',
} as const;

export const AUTH_KEYS = {
  TOKEN: 'auth_token',
  ROLE: 'auth_role',
  REMEMBER_USER: 'remember_user',
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  ISSUE_PASS: (sessionId: string) => `/event-sessions/${sessionId}/passes:issue`,
  CHECK_IN: (sessionId: string) => `/event-sessions/${sessionId}/check-ins`,
  BULK_UPLOAD: (sessionId: string) => `/event-sessions/${sessionId}/bulk-upload`,
  BULK_UPLOAD_JOB: (jobId: string) => `/bulk-upload/jobs/${jobId}`,
  GET_ATTENDEES: (sessionId: string) => `/event-sessions/${sessionId}/attendees`,
  REGISTER_ATTENDEE: (sessionId: string) => `/event-sessions/${sessionId}/attendees`,
} as const;

export const SCANNER_CONFIG = {
  fps: 10,
  qrbox: { width: 250, height: 250 },
} as const;
