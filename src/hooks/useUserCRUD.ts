/**
 * useUserCRUD Hook
 * 
 * Custom React hook for managing CRUD operations (Create, Read, Update, Delete).
 * Handles loading states for each operation independently to provide better UX.
 * Manages success/error states and provides callbacks for components.
 * 
 * Props:
 * - onSuccess: Optional callback when operation succeeds
 * - onError: Optional callback when operation fails
 * 
 * Returns:
 * - state: Object with loading states for each operation
 * - createUser: Function to create a new user
 * - updateUser: Function to update an existing user
 * - deleteUser: Function to delete a user
 * - lastError: Last error message that occurred
 * - clearError: Function to clear error state
 */

'use client';

import { useState } from 'react';
import { User, UserFormData, LoadingState } from '@/src/types/user';
import * as api from '@/src/services/api';

interface UseUserCRUDProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

interface UseUserCRUDReturn {
  state: LoadingState;
  createUser: (data: UserFormData) => Promise<User | null>;
  updateUser: (id: string, data: UserFormData) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
  lastError: string | null;
  clearError: () => void;
}

/**
 * useUserCRUD Hook
 * Provides CRUD operation functions with individual loading states
 */
export const useUserCRUD = ({
  onSuccess,
  onError,
}: UseUserCRUDProps = {}): UseUserCRUDReturn => {
  // Track loading states for each operation type
  const [state, setState] = useState<LoadingState>({
    list: false,
    creating: false,
    updating: false,
    deleting: null,
  });

  // Store last error message for display
  const [lastError, setLastError] = useState<string | null>(null);

  /**
   * Creates a new user
   * Sets creating state during operation
   */
  const createUser = async (data: UserFormData): Promise<User | null> => {
    try {
      setState((prev) => ({ ...prev, creating: true }));
      setLastError(null);

      const response = await api.createUser(data);

      if (response.success && response.data) {
        onSuccess?.('User created successfully');
        return response.data;
      } else {
        const error = response.error || 'Failed to create user';
        setLastError(error);
        onError?.(error);
        return null;
      }
    } catch (err) {
      const error = 'An unexpected error occurred while creating the user';
      setLastError(error);
      onError?.(error);
      console.error('[v0] Error creating user:', err);
      return null;
    } finally {
      setState((prev) => ({ ...prev, creating: false }));
    }
  };

  /**
   * Updates an existing user
   * Sets updating state during operation
   */
  const updateUser = async (id: string, data: UserFormData): Promise<User | null> => {
    try {
      setState((prev) => ({ ...prev, updating: true }));
      setLastError(null);

      const response = await api.updateUser(id, data);

      if (response.success && response.data) {
        onSuccess?.('User updated successfully');
        return response.data;
      } else {
        const error = response.error || 'Failed to update user';
        setLastError(error);
        onError?.(error);
        return null;
      }
    } catch (err) {
      const error = 'An unexpected error occurred while updating the user';
      setLastError(error);
      onError?.(error);
      console.error('[v0] Error updating user:', err);
      return null;
    } finally {
      setState((prev) => ({ ...prev, updating: false }));
    }
  };

  /**
   * Deletes a user
   * Sets deleting state with the user ID being deleted
   */
  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, deleting: id }));
      setLastError(null);

      const response = await api.deleteUser(id);

      if (response.success) {
        onSuccess?.('User deleted successfully');
        return true;
      } else {
        const error = response.error || 'Failed to delete user';
        setLastError(error);
        onError?.(error);
        return false;
      }
    } catch (err) {
      const error = 'An unexpected error occurred while deleting the user';
      setLastError(error);
      onError?.(error);
      console.error('[v0] Error deleting user:', err);
      return false;
    } finally {
      setState((prev) => ({ ...prev, deleting: null }));
    }
  };

  /**
   * Clears the last error message
   * Useful when user dismisses error notification
   */
  const clearError = () => {
    setLastError(null);
  };

  return {
    state,
    createUser,
    updateUser,
    deleteUser,
    lastError,
    clearError,
  };
};
