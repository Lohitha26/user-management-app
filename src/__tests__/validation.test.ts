/**
 * Validation Utilities Unit Tests
 *
 * Tests all validation functions used by the schema-driven form system.
 * Covers name, email, phone validators, the field router, and full-form validation.
 */

import {
  validateName,
  validateEmail,
  validatePhone,
  validateField,
  validateFormData,
  isFormValid,
} from '@/src/utils/validation';

// ---------------------------------------------------------------------------
// validateName
// ---------------------------------------------------------------------------
describe('validateName', () => {
  it('returns error for empty string', () => {
    expect(validateName('')).toBe('This field is required');
  });

  it('returns error for whitespace-only string', () => {
    expect(validateName('   ')).toBe('This field is required');
  });

  it('returns error for single character', () => {
    expect(validateName('A')).toBe('Name must be at least 2 characters');
  });

  it('returns error for name exceeding 50 characters', () => {
    const longName = 'A'.repeat(51);
    expect(validateName(longName)).toBe('Name must not exceed 50 characters');
  });

  it('returns error for name with numbers', () => {
    expect(validateName('John123')).toContain('can only contain letters');
  });

  it('returns empty string for valid name', () => {
    expect(validateName('Alice')).toBe('');
  });

  it('allows hyphens and apostrophes', () => {
    expect(validateName("O'Brien")).toBe('');
    expect(validateName('Mary-Jane')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// validateEmail
// ---------------------------------------------------------------------------
describe('validateEmail', () => {
  it('returns error for empty string', () => {
    expect(validateEmail('')).toBe('Email is required');
  });

  it('returns error for invalid email format', () => {
    expect(validateEmail('notanemail')).toBe('Please enter a valid email address');
    expect(validateEmail('missing@tld')).toBe('Please enter a valid email address');
    expect(validateEmail('@no-local.com')).toBe('Please enter a valid email address');
  });

  it('returns empty string for valid email', () => {
    expect(validateEmail('user@example.com')).toBe('');
    expect(validateEmail('first.last@domain.co')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// validatePhone
// ---------------------------------------------------------------------------
describe('validatePhone', () => {
  it('returns error for empty string', () => {
    expect(validatePhone('')).toBe('Phone number is required');
  });

  it('returns error for too few digits', () => {
    expect(validatePhone('12345')).toBe('Phone number must contain at least 10 digits');
  });

  it('returns empty string for valid 10-digit phone', () => {
    expect(validatePhone('1234567890')).toBe('');
  });

  it('handles formatted phone numbers', () => {
    expect(validatePhone('(555) 123-4567')).toBe('');
  });

  it('handles international format with +', () => {
    expect(validatePhone('+11234567890')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// validateField (router)
// ---------------------------------------------------------------------------
describe('validateField', () => {
  it('routes to name validator', () => {
    expect(validateField('firstName', '', 'name')).toBe('This field is required');
    expect(validateField('firstName', 'Al', 'name')).toBe('');
  });

  it('routes to email validator', () => {
    expect(validateField('email', 'bad', 'email')).toBe('Please enter a valid email address');
    expect(validateField('email', 'ok@ok.com', 'email')).toBe('');
  });

  it('routes to phone validator', () => {
    expect(validateField('phone', '123', 'phone')).toBe('Phone number must contain at least 10 digits');
  });

  it('falls back to required check when no validation type', () => {
    expect(validateField('custom', '', undefined)).toBe('This field is required');
    expect(validateField('custom', 'value', undefined)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// validateFormData (schema-driven)
// ---------------------------------------------------------------------------
describe('validateFormData', () => {
  it('returns errors for all empty fields', () => {
    const errors = validateFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });
    expect(Object.keys(errors).length).toBeGreaterThan(0);
    expect(errors.firstName).toBeTruthy();
    expect(errors.lastName).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.phone).toBeTruthy();
  });

  it('returns no errors for fully valid data', () => {
    const errors = validateFormData({
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      phone: '1234567890',
    });
    expect(Object.keys(errors).length).toBe(0);
  });

  it('returns partial errors when some fields are invalid', () => {
    const errors = validateFormData({
      firstName: 'Alice',
      lastName: '',
      email: 'alice@example.com',
      phone: '123',
    });
    expect(errors.firstName).toBeUndefined();
    expect(errors.lastName).toBeTruthy();
    expect(errors.email).toBeUndefined();
    expect(errors.phone).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// isFormValid
// ---------------------------------------------------------------------------
describe('isFormValid', () => {
  it('returns true for empty errors object', () => {
    expect(isFormValid({})).toBe(true);
  });

  it('returns true when all error values are empty strings', () => {
    expect(isFormValid({ firstName: '', email: '' })).toBe(true);
  });

  it('returns false when any error value is non-empty', () => {
    expect(isFormValid({ firstName: 'Required' })).toBe(false);
  });
});
