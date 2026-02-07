/**
 * User Types and Interfaces
 * 
 * This file defines TypeScript interfaces for the entire user management system.
 * It ensures type safety across the application and serves as the single source
 * of truth for user data structure.
 */

/**
 * User data interface
 * Represents a user in the application with all required properties
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
}

/**
 * User form data interface
 * Used for form submission and editing, excludes id and timestamps
 */
export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * Schema field definition interface
 * Defines how form fields should be rendered and validated
 */
export interface SchemaField {
  name: keyof UserFormData;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date';
  required: boolean;
  validation?: 'name' | 'email' | 'phone' | 'date';
  placeholder?: string;
}

/**
 * Validation error interface
 * Maps field names to their validation error messages
 */
export interface ValidationErrors {
  [key: string]: string;
}

/**
 * API response interface
 * Standard response format for API calls
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Loading states interface
 * Tracks loading state for different operations
 */
export interface LoadingState {
  list: boolean;
  creating: boolean;
  updating: boolean;
  deleting: string | null; // null when not deleting, or the user id being deleted
}
