import { useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/authService';
import { AUTH_KEYS } from '../constants';
import type { LoginCredentials, AuthResponse, ApiError } from '../types';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, LoginCredentials>({
    mutationFn: async (credentials) => {
      return authService.login(credentials);
    },
    onSuccess: (data) => {
      // Set tokens and details upon successful validation
      localStorage.setItem(AUTH_KEYS.TOKEN, data.token);
      localStorage.setItem(AUTH_KEYS.ROLE, data.user.role);
      
      // Invalidate existing queries to trigger reactive updates across panels
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      console.log(`[useLogin Mutation] Saved credentials to storage. User Role: ${data.user.role}`);
    },
    onError: (error) => {
      console.error('[useLogin Mutation Error]', error);
    }
  });
};
