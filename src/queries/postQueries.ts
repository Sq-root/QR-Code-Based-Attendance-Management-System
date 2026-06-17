import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { Post, ApiError } from '../types';

// Fetch all posts query
export const usePosts = (limit: number = 5) => {
  return useQuery<Post[], ApiError>({
    queryKey: ['posts', limit],
    queryFn: async (): Promise<Post[]> => {
      const response = await api.get<Post[]>(`/posts?_limit=${limit}`);
      return response.data;
    },
  });
};

// Fetch a single post query
export const usePost = (id: number) => {
  return useQuery<Post, ApiError>({
    queryKey: ['post', id],
    queryFn: async (): Promise<Post> => {
      const response = await api.get<Post>(`/posts/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run query if id is truthy
  });
};

// Create a post mutation (demonstrating TanStack Query mutations)
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Post, ApiError, Omit<Post, 'id'>>({
    mutationFn: async (newPost): Promise<Post> => {
      const response = await api.post<Post>('/posts', newPost);
      return response.data;
    },
    onSuccess: (data) => {
      // Optimistic update or refetch of 'posts' query list
      queryClient.setQueryData<Post[]>(['posts', 5], (oldPosts) => {
        if (!oldPosts) return [data];
        // Prepend the newly created post (at index 0)
        return [data, ...oldPosts.slice(0, 4)];
      });
      console.log('[useCreatePost Hook] Successfully created post! Local Query Cache updated.');
    },
  });
};
