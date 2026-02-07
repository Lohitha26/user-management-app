/**
 * UserCard Component
 * 
 * Displays a single user's information in a card format.
 * Provides action buttons for editing and deleting the user.
 * Used in grid layouts for a visually appealing user list display.
 * 
 * Props:
 * - user: The user object to display
 * - onEdit: Callback when edit button is clicked
 * - onDelete: Callback when delete button is clicked
 * - isDeleting: Whether a deletion is in progress for this user
 */

'use client';

import React from 'react';
import { User } from '@/src/types/user';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isDeleting: boolean;
}

/**
 * UserCard Component
 * Renders user information in a card with action buttons
 * Provides visual feedback for loading states
 */
export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const createdDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="card group"
      role="article"
      aria-label={`${user.firstName} ${user.lastName}`}
    >
      {/* User header with avatar and name */}
      <div className="flex items-start gap-4 mb-5">
        {/* Avatar - gradient background with initials */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg text-white bg-gradient-to-br from-indigo-600 to-purple-600"
          aria-label={`Avatar for ${user.firstName} ${user.lastName}`}
        >
          {initials}
        </div>

        {/* Name section */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold truncate text-slate-900">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm truncate text-slate-600">
            Added {createdDate}
          </p>
        </div>
      </div>

      {/* Contact information */}
      <div className="space-y-3 mb-6 text-sm">
        {/* Email */}
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a
            href={`mailto:${user.email}`}
            className="truncate hover:underline transition-colors text-indigo-600"
          >
            {user.email}
          </a>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 4.493a1 1 0 00.502.756l2.048 1.024a11.07 11.07 0 01-5.693 5.692l-1.024-2.048a1 1 0 00-.756-.502l-4.493-1.498A1 1 0 005.28 5H5m6 16h.01M19 21h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2.5" />
          </svg>
          <a
            href={`tel:${user.phone}`}
            className="truncate hover:underline transition-colors text-indigo-600"
          >
            {user.phone}
          </a>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-5 border-t border-indigo-100">
        {/* Edit button */}
        <button
          onClick={() => onEdit(user)}
          disabled={isDeleting}
          className="btn-secondary flex-1 h-10"
        >
          Edit
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete(user)}
          disabled={isDeleting}
          className="btn-danger flex-1 h-10"
        >
          {isDeleting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Deleting...
            </span>
          ) : (
            'Delete'
          )}
        </button>
      </div>
    </div>
  );
};
