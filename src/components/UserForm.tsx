/**
 * UserForm Component
 * 
 * A schema-driven form component that dynamically renders fields based on the
 * userSchema configuration. This component handles both create and edit modes,
 * manages form state, validation, and submission.
 * 
 * Key Features:
 * - Dynamic field rendering from schema configuration
 * - Real-time field validation with inline error messages
 * - Form-level validation before submission
 * - Loading states during submission
 * - Clear form button to reset all fields
 * - Submit button disabled until form is valid
 * - Support for both create and edit modes
 * 
 * Props:
 * - onSubmit: Callback with form data when submitted
 * - initialData: Pre-filled form data for edit mode (optional)
 * - isLoading: Whether a submission is in progress
 * - mode: "create" or "edit" mode
 * - onCancel: Optional callback for cancel button
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { UserFormData, ValidationErrors } from '@/src/types/user';
import { userSchema } from '@/src/config/userSchema';
import { validateField, validateFormData, isFormValid } from '@/src/utils/validation';
import { FormField } from './FormField';

/**
 * Generates an empty form data object from the schema.
 * This ensures adding a new field to userSchema automatically
 * creates a default empty value without touching this component.
 */
const getEmptyFormData = (): UserFormData => {
  const data: Record<string, string> = {};
  userSchema.forEach((field) => {
    data[field.name] = '';
  });
  return data as unknown as UserFormData;
};

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
  onCancel?: () => void;
}

/**
 * UserForm Component
 * Renders a form with fields defined in userSchema
 * Manages validation state and provides user feedback
 */
export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  mode = 'create',
  onCancel,
}) => {
  // Form state - stores current field values (schema-driven defaults)
  const emptyForm = useMemo(() => getEmptyFormData(), []);
  const [formData, setFormData] = useState<UserFormData>(initialData || emptyForm);

  // Validation state - stores error messages for each field
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Track which fields have been touched for better UX
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Keep form state in sync when switching between create and edit modes
  useEffect(() => {
    setFormData(initialData || getEmptyFormData());
    setErrors({});
    setTouched({});
  }, [initialData]);

  /**
   * Handle input field changes
   * Updates form data and validates the field
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate the field if it has been touched
    if (touched[name]) {
      const fieldSchema = userSchema.find((field) => field.name === name);
      const error = validateField(name, value, fieldSchema?.validation);

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  /**
   * Handle field blur event
   * Marks field as touched and validates it
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate the field
    const fieldSchema = userSchema.find((field) => field.name === name);
    const error = validateField(name, value, fieldSchema?.validation);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  /**
   * Handle form submission
   * Validates all fields before calling onSubmit
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate entire form using schema-driven validation
    const newErrors = validateFormData(formData);

    if (!isFormValid(newErrors)) {
      setErrors(newErrors);
      // Mark all schema fields as touched to show errors
      const touchedFields: Record<string, boolean> = {};
      userSchema.forEach((field) => {
        touchedFields[field.name] = true;
      });
      setTouched((prev) => ({ ...prev, ...touchedFields }));
      return;
    }

    // Form is valid, call submission handler
    onSubmit(formData);
  };

  /**
   * Clear form to initial state
   * Resets all fields and validation state
   */
  const handleClearForm = () => {
    setFormData(getEmptyFormData());
    setErrors({});
    setTouched({});
  };

  // Check if form is currently valid
  const isFormValidNow = isFormValid(errors) && Object.values(formData).every((v) => v.trim().length > 0);

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Form title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          {mode === 'create' ? 'Create User' : 'Edit User'}
        </h2>
        <p className="text-sm mt-2 text-slate-600">
          {mode === 'create'
            ? 'Fill in the details to add a new user.'
            : 'Update the user information.'}
        </p>
      </div>

      {/* Form fields - rendered from schema */}
      <div className="space-y-5">
        {userSchema.map((field) => (
          <FormField
            key={field.name}
            fieldName={field.name}
            label={field.label}
            type={field.type}
            value={formData[field.name] as string}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[field.name] || ''}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isLoading}
          />
        ))}
      </div>

      {/* Form action buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-indigo-100">
        {/* Cancel button - optional, calls onCancel if provided */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        )}

        {/* Clear button - clears all fields */}
        <button
          type="button"
          onClick={handleClearForm}
          disabled={isLoading}
          className="btn-secondary flex-1"
        >
          Clear
        </button>

        {/* Submit button - disabled until form is valid */}
        <button
          type="submit"
          disabled={!isFormValidNow || isLoading}
          className="btn-primary flex-1"
        >
          {isLoading
            ? mode === 'create'
              ? 'Creating...'
              : 'Updating...'
            : mode === 'create'
              ? 'Create'
              : 'Update'}
        </button>
      </div>
    </form>
  );
};
