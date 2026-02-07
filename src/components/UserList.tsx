/**
 * UserList Component
 * 
 * Displays a grid of UserCard components for all users.
 * Includes loading states, empty state handling, and user count display.
 * Provides a clean, responsive grid layout for displaying users.
 * 
 * Props:
 * - users: Array of user objects to display
 * - onEdit: Callback when edit button is clicked on a user
 * - onDelete: Callback when delete button is clicked on a user
 * - isLoading: Whether users are being loaded
 * - deletingUserId: ID of user currently being deleted
 */

'use client';

import React from 'react';
import { User } from '@/src/types/user';
import { UserCard } from './UserCard';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading: boolean;
  deletingUserId: string | null;
}

/**
 * UserList Component
 * Renders a responsive grid of user cards
 * Handles loading and empty states with appropriate messages
 */
export const UserList: React.FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
  isLoading,
  deletingUserId,
}) => {
  // Loading state - show skeleton loaders
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Loading users...</h2>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card animate-pulse"
            >
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-200" />
                <div className="flex-1">
                  <div className="h-4 rounded mb-2 w-32 bg-slate-200" />
                  <div className="h-3 rounded w-24 bg-slate-100" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 rounded w-full bg-slate-100" />
                <div className="h-3 rounded w-48 bg-slate-100" />
              </div>
              <div className="flex gap-2 pt-4 border-t border-indigo-100">
                <div className="flex-1 h-10 rounded bg-slate-200" />
                <div className="flex-1 h-10 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state - no users to display
  if (users.length === 0) {
    return (
      <div className="text-center py-20">
        {/* Empty state icon */}
        <div className="mb-4 flex justify-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center bg-indigo-100"
          >
            <svg
              className="w-10 h-10 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        </div>

        {/* Empty state message */}
        <h3 className="text-lg font-bold mb-2 text-slate-900">No users yet</h3>
        <p className="text-sm text-slate-600">Create your first user to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filter bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Users</h2>
          <p className="text-sm mt-1 text-slate-600">
            {users.length} {users.length === 1 ? 'user' : 'users'} in total
          </p>
        </div>
        <div 
          className="px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700"
        >
          {users.length}
        </div>
      </div>

      {/* User grid - responsive layout */}
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={deletingUserId === user.id}
          />
        ))}
      </div>
    </div>
  );
};
