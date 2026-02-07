/**
 * FormField Component
 * 
 * A reusable, schema-driven form field component that handles rendering and validation.
 * This component abstracts the common pattern of input field with label, validation,
 * and error messages. It works seamlessly with the form schema system.
 * 
 * Props:
 * - fieldName: The name of the field (must match UserFormData keys)
 * - label: Display label for the field
 * - type: HTML input type (text, email, tel, etc.)
 * - value: Current field value
 * - onChange: Callback when field value changes
 * - error: Error message to display (empty if valid)
 * - placeholder: Placeholder text for the input
 * - required: Whether the field is required (shows asterisk)
 * - onBlur: Optional callback when field loses focus
 * - disabled: Whether the field is disabled
 */

'use client';

import React from 'react';

interface FormFieldProps {
  fieldName: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  placeholder?: string;
  required?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

/**
 * FormField Component
 * Renders an input field with label, validation feedback, and error messages
 * Provides consistent styling and behavior across all form fields
 */
export const FormField: React.FC<FormFieldProps> = ({
  fieldName,
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  onBlur,
  disabled = false,
}) => {
  const isInvalid = error.length > 0;

  return (
    <div className="w-full">
      {/* Label with required indicator */}
      <label
        htmlFor={fieldName}
        className="block text-sm font-medium mb-2 text-slate-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {/* Input field container with icon support */}
      <div className="relative">
        <input
          id={fieldName}
          name={fieldName}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-11 px-4 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
            isInvalid
              ? 'border-red-500 bg-red-50 text-slate-900'
              : 'border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
          } ${disabled ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}`}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? `${fieldName}-error` : undefined}
        />

        {/* Error icon */}
        {isInvalid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Success icon */}
        {!isInvalid && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Error message - displayed below field when validation fails */}
      {isInvalid && (
        <p id={`${fieldName}-error`} className="text-sm mt-2 font-medium flex items-center gap-1 text-red-600">
          <span>●</span>
          {error}
        </p>
      )}
    </div>
  );
};
