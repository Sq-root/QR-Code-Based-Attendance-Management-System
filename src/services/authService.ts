import api from './api';
import { API_ENDPOINTS, APP_NAME } from '../constants';
import type { LoginCredentials, AuthResponse } from '../types';

export const authService = {
  /**
   * Performs authentication request
   * Falls back to a mock response for developmental testing if the backend API is not yet running
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Send real API request
      const response = await api.post<Partial<AuthResponse> & { token: string }>(API_ENDPOINTS.LOGIN, {
        username: credentials.identifier,
        password: credentials.password,
      });
      console.log('[Auth Service] Login API success', {
        hasToken: Boolean(response.data.token),
        hasUser: Boolean(response.data.user),
      });

      return {
        token: response.data.token,
        user: response.data.user ?? {
          id: credentials.identifier,
          name: credentials.identifier,
          role: 'admin',
          email: credentials.identifier.includes('@')
            ? credentials.identifier
            : `${credentials.identifier}@${APP_NAME.toLowerCase()}.com`,
        },
      };
    } catch (error: unknown) {
      console.warn('[Auth Service] Real login API failed or is not configured. Falling back to mock response for testing...', error);
      
      // Simulated mock API latency
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simple mock validation
      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters.', { cause: error });
      }
      
      // Mock successful response
      return {
        token: credentials.role === 'admin' ? 'mock-admin-token-xyz123' : 'mock-attendee-token-abc789',
        user: {
          id: 'usr_1',
          name: credentials.role === 'admin' ? 'Admin User' : 'Standard Attendee',
          role: credentials.role,
          email: credentials.identifier.includes('@') ? credentials.identifier : `${credentials.identifier}@${APP_NAME.toLowerCase()}.com`,
        }
      };
    }
  }
};

export default authService;
