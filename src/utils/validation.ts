/**
 * Validation Utilities
 * 
 * This module provides validation functions for user form fields.
 * Each validation function checks if a field value meets the specified requirements
 * and returns an error message if validation fails (or empty string if valid).
 * 
 * EXTENSIBILITY GUIDE:
 * To add validation for a new field type:
 * 1. Create a new validation function following the same pattern
 * 2. Export it and use it in validateField()
 * 3. Update the SchemaField type with the new validation type
 */

import { UserFormData, ValidationErrors } from '@/src/types/user';
import { userSchema } from '@/src/config/userSchema';

/**
 * Validates a name field (first or last name)
 * Requirements: 2-50 characters, letters and spaces only
 *
 * @param value - The name value to validate
 * @returns Error message or empty string if valid
 */
export const validateName = (value: string): string => {
  if (!value || value.trim().length === 0) {
    return 'This field is required';
  }
  if (value.length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (value.length > 50) {
    return 'Name must not exceed 50 characters';
  }
  // Allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s'-]+$/.test(value)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return '';
};

/**
 * Validates an email address
 * Requirements: Valid email format according to RFC 5322 simplified
 *
 * @param value - The email value to validate
 * @returns Error message or empty string if valid
 */
export const validateEmail = (value: string): string => {
  if (!value || value.trim().length === 0) {
    return 'Email is required';
  }
  // RFC 5322 simplified regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return '';
};

/**
 * Validates a phone number
 * Requirements: 10 digits (US) or international format with country code
 *
 * @param value - The phone value to validate
 * @returns Error message or empty string if valid
 */
export const validatePhone = (value: string): string => {
  if (!value || value.trim().length === 0) {
    return 'Phone number is required';
  }
  // Remove common formatting characters
  const cleanedPhone = value.replace(/[\s()-]/g, '');
  // Accept 10+ digit phone numbers (US or international)
  if (!/^\+?[\d]{10,}$/.test(cleanedPhone)) {
    return 'Phone number must contain at least 10 digits';
  }
  return '';
};

/**
 * Main validation function that routes to specific validators
 * Used by form fields to validate individual field values
 *
 * @param fieldName - The name of the field being validated
 * @param value - The value to validate
 * @param validation - The type of validation to apply
 * @returns Error message or empty string if valid
 */
export const validateField = (
  fieldName: string,
  value: string,
  validation?: string
): string => {
  switch (validation) {
    case 'name':
      return validateName(value);
    case 'email':
      return validateEmail(value);
    case 'phone':
      return validatePhone(value);
    default:
      // Basic required field validation
      return !value || value.trim().length === 0 ? 'This field is required' : '';
  }
};

/**
 * Validates entire form data object using the schema configuration.
 * This is fully schema-driven: adding a new field to userSchema automatically
 * includes it in form-level validation with zero code changes here.
 *
 * @param formData - The form data to validate
 * @returns Object mapping field names to error messages
 */
export const validateFormData = (
  formData: UserFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  userSchema.forEach((field) => {
    const value = formData[field.name] as string;
    const error = validateField(field.name, value || '', field.validation);
    if (error) {
      errors[field.name] = error;
    }
  });

  return errors;
};

/**
 * Checks if a form has any validation errors
 *
 * @param errors - The validation errors object
 * @returns true if no errors, false if there are errors
 */
export const isFormValid = (errors: ValidationErrors): boolean => {
  return Object.values(errors).every((error) => !error);
};
