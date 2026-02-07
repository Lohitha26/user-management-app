/**
 * FormField Component Unit Tests
 *
 * Tests the reusable form field component for rendering, validation display,
 * accessibility attributes, and user interaction.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormField } from '@/src/components/FormField';

const defaultProps = {
  fieldName: 'firstName',
  label: 'First Name',
  type: 'text' as const,
  value: '',
  onChange: jest.fn(),
  error: '',
};

describe('FormField', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders label and input', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
  });

  it('shows required asterisk when required', () => {
    render(<FormField {...defaultProps} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show asterisk when not required', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays error message when error prop is non-empty', () => {
    render(<FormField {...defaultProps} error="Name is required" />);
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('sets aria-invalid when there is an error', () => {
    render(<FormField {...defaultProps} error="Required" />);
    const input = screen.getByLabelText('First Name');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('calls onChange when user types', () => {
    const onChange = jest.fn();
    render(<FormField {...defaultProps} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Alice' },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur when input loses focus', () => {
    const onBlur = jest.fn();
    render(<FormField {...defaultProps} onBlur={onBlur} />);
    fireEvent.blur(screen.getByLabelText('First Name'));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('disables input when disabled prop is true', () => {
    render(<FormField {...defaultProps} disabled />);
    expect(screen.getByLabelText('First Name')).toBeDisabled();
  });

  it('renders placeholder text', () => {
    render(<FormField {...defaultProps} placeholder="John" />);
    expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
  });

  it('sets the name attribute on the input for form handling', () => {
    render(<FormField {...defaultProps} />);
    const input = screen.getByLabelText('First Name');
    expect(input).toHaveAttribute('name', 'firstName');
  });
});
