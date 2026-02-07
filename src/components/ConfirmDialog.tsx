/**
 * ConfirmDialog Component
 * 
 * A reusable confirmation dialog component for dangerous operations like delete.
 * Shows a warning message and requires user confirmation before proceeding.
 * Built as a controlled component - parent must manage open/close state.
 * 
 * Props:
 * - open: Whether the dialog is visible
 * - title: Dialog title
 * - message: Confirmation message to display
 * - onConfirm: Callback when user confirms
 * - onCancel: Callback when user cancels
 * - confirmText: Text for confirm button (default: "Delete")
 * - cancelText: Text for cancel button (default: "Cancel")
 * - isLoading: Whether an operation is in progress
 * - isDangerous: Whether to use red color scheme (default: true)
 */

'use client';

import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDangerous?: boolean;
}

/**
 * ConfirmDialog Component
 * Displays a modal dialog for confirming potentially destructive actions
 * Blocks interaction with page content until dialog is closed
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
  isDangerous = true,
}) => {
  // Don't render anything if not open
  if (!open) return null;

  return (
    <>
      {/* Semi-transparent overlay with glassmorphism - blocks interaction with page */}
      <div
        className="fixed inset-0 z-40 transition-opacity bg-black/50"
        onClick={onCancel}
        role="presentation"
      />

      {/* Dialog container - centered on screen */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="rounded-2xl w-full max-w-sm overflow-hidden transform transition-all bg-white shadow-2xl"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-message"
        >
          {/* Dialog header with icon */}
          <div 
            className="px-6 pt-6 pb-4 flex items-start gap-4"
          >
            {/* Warning icon */}
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100"
            >
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Title */}
            <div className="flex-1">
              <h2 id="dialog-title" className="text-lg font-bold text-slate-900">
                {title}
              </h2>
            </div>
          </div>

          {/* Dialog body */}
          <div className="px-6 py-3">
            <p id="dialog-message" className="text-sm leading-relaxed text-slate-600">
              {message}
            </p>
          </div>

          {/* Dialog footer with buttons */}
          <div className="px-6 py-4 flex gap-3 justify-end border-t border-indigo-100">
            {/* Cancel button */}
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="btn-secondary px-4 h-10"
            >
              {cancelText}
            </button>

            {/* Confirm button - danger red for delete */}
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="btn-danger px-4 h-10"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Processing...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
