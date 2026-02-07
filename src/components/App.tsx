/**
 * Main App Component
 * 
 * The core application component that orchestrates all CRUD operations.
 * Manages the main state machine for switching between view/list/form modes.
 * Coordinates data fetching, form submission, and deletion confirmation.
 * 
 * Features:
 * - View/List mode: Display all users
 * - Create mode: Show form to add new user
 * - Edit mode: Show form to update existing user
 * - Delete confirmation: Confirm before deleting
 * - Notifications: Show success/error messages
 * - Loading states: Feedback during API operations
 * 
 * This is the main container component that all other components connect through.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { User, UserFormData } from '@/src/types/user';
import { useUsers } from '@/src/hooks/useUsers';
import { useUserCRUD } from '@/src/hooks/useUserCRUD';
import { UserForm } from './UserForm';
import { UserList } from './UserList';
import { ConfirmDialog } from './ConfirmDialog';

type AppMode = 'list' | 'create' | 'edit';

/**
 * App Component
 * Main application container managing all state and operations
 */
export const App: React.FC = () => {
  // UI state - tracks which view is displayed
  const [mode, setMode] = useState<AppMode>('list');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);

  // User data state from custom hooks
  const { users, isLoading: isLoadingUsers, refetch: refetchUsers, setUsers } = useUsers();
  const {
    state: crudState,
    createUser,
    updateUser,
    deleteUser,
    lastError,
    clearError,
  } = useUserCRUD({
    onSuccess: (message) => {
      toast.success(message);
      refetchUsers();
      setMode('list');
      setEditingUser(null);
    },
    onError: (message) => {
      toast.error(message);
    },
  });

  /**
   * Handle form submission for both create and edit modes
   */
  const handleFormSubmit = useCallback(
    async (formData: UserFormData) => {
      if (mode === 'create') {
        // Create mode - submit new user
        const result = await createUser(formData);
        if (result) {
          // Success - will refetch and return to list
        }
      } else if (mode === 'edit' && editingUser) {
        // Edit mode - update existing user
        const result = await updateUser(editingUser.id, formData);
        if (result) {
          // Success - will refetch and return to list
        }
      }
    },
    [mode, editingUser, createUser, updateUser]
  );

  /**
   * Handle starting to create a new user
   */
  const handleStartCreate = useCallback(() => {
    setMode('create');
    setEditingUser(null);
    clearError();
  }, [clearError]);

  /**
   * Handle starting to edit a user
   */
  const handleStartEdit = useCallback((user: User) => {
    setMode('edit');
    setEditingUser(user);
    clearError();
  }, [clearError]);

  /**
   * Handle delete confirmation
   */
  const handleConfirmDelete = useCallback(async () => {
    if (deleteConfirmUser) {
      const success = await deleteUser(deleteConfirmUser.id);
      if (success) {
        setDeleteConfirmUser(null);
        // Refetch will happen via onSuccess callback
      }
    }
  }, [deleteConfirmUser, deleteUser]);

  /**
   * Handle cancel operations - return to list view
   */
  const handleCancel = useCallback(() => {
    setMode('list');
    setEditingUser(null);
    clearError();
  }, [clearError]);

  /**
   * Get loading state for submit button
   */
  const isSubmitting = mode === 'create' ? crudState.creating : crudState.updating;

  // Render different UI based on current mode
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header with glassmorphism */}
      <header 
        className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo/Title */}
          <div>
            <h1 className="text-xl font-bold text-indigo-600">
              User Manager
            </h1>
          </div>

          {/* User count badge */}
          <div 
            className="px-3 py-1 rounded-full text-sm font-semibold text-white bg-indigo-600"
          >
            {users.length} {users.length === 1 ? 'user' : 'users'}
          </div>
        </div>
      </header>

      {/* Main layout - two column for desktop, single for mobile */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT PANEL - Form (40% on desktop) */}
          <div className="lg:col-span-2">
            {/* Sticky form container */}
            <div className="lg:sticky lg:top-24">
              <div 
                className="rounded-2xl p-8 border border-indigo-100 transition-all duration-300 bg-slate-50"
              >
                {mode === 'list' ? (
                  // List mode - show create button
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-indigo-100">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-slate-900">
                      Add New User
                    </h2>
                    <p className="text-sm mb-6 text-slate-600">
                      Click the button below to create a new user account in the system.
                    </p>
                    <button
                      onClick={handleStartCreate}
                      disabled={isLoadingUsers}
                      className="btn-primary w-full"
                    >
                      Create User
                    </button>

                    {/* Error message - shown when operations fail */}
                    {lastError && (
                      <div className="mt-4 p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
                        <p className="text-sm font-medium text-red-700">
                          {lastError}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Form mode - create or edit
                  <>
                    <UserForm
                      mode={mode}
                      initialData={
                        editingUser
                          ? {
                              firstName: editingUser.firstName,
                              lastName: editingUser.lastName,
                              email: editingUser.email,
                              phone: editingUser.phone,
                            }
                          : undefined
                      }
                      onSubmit={handleFormSubmit}
                      isLoading={isSubmitting}
                      onCancel={handleCancel}
                    />

                    {/* Error message in form mode */}
                    {lastError && (
                      <div className="mt-4 p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
                        <p className="text-sm font-medium text-red-700">
                          {lastError}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - User List (60% on desktop) */}
          <div className="lg:col-span-3">
            <UserList
              users={users}
              onEdit={handleStartEdit}
              onDelete={(user) => setDeleteConfirmUser(user)}
              isLoading={isLoadingUsers}
              deletingUserId={crudState.deleting}
            />
          </div>
        </div>
      </main>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteConfirmUser !== null}
        title="Delete User"
        message={
          deleteConfirmUser
            ? `Are you sure you want to delete ${deleteConfirmUser.firstName} ${deleteConfirmUser.lastName}? This action cannot be undone.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmUser(null)}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={crudState.deleting !== null}
      />
    </div>
  );
};
