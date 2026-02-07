/**
 * useUsers Hook
 * 
 * Custom React hook for managing user data fetching and state.
 * Handles loading state, error handling, and user list management.
 * Provides a clean interface for components to interact with user data.
 * 
 * Returns:
 * - users: Array of user objects
 * - isLoading: Whether users are currently being loaded
 * - error: Error message if loading failed
 * - refetch: Function to manually refetch users
 * - setUsers: Function to manually update users list
 */

'use client';

import { useState, useEffect } from 'react';
import { User, ApiResponse } from '@/src/types/user';
import * as api from '@/src/services/api';

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setUsers: (users: User[]) => void;
}

/**
 * useUsers Hook
 * Manages fetching and state for user list
 * Automatically loads users on component mount
 */
export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches users from API
   * Called on mount and manually via refetch
   */
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response: ApiResponse<User[]> = await api.getUsers();

      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Failed to load users');
      }
    } catch (err) {
      setError('An unexpected error occurred while loading users');
      console.error('[v0] Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manual refetch function for components to use
   */
  const refetch = async () => {
    await fetchUsers();
  };

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    refetch,
    setUsers,
  };
};
