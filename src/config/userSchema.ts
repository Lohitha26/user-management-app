/**
 * User Schema Configuration
 * 
 * This file defines the form fields and their properties in a centralized location.
 * This schema-driven approach allows for easy extension - adding new fields requires
 * only updating this configuration file and the UserFormData interface in types/user.ts.
 * 
 * EXTENSIBILITY GUIDE:
 * To add a new field like "Department":
 * 1. Add the field to the UserFormData interface in types/user.ts
 * 2. Add a new object to the userSchema array below
 * 3. Add validation logic in utils/validation.ts if needed
 * 
 * The form components will automatically render the new field!
 */

import { SchemaField } from '@/src/types/user';

/**
 * User form schema configuration
 * Defines all fields that appear in the user form with their validation rules
 * Order in this array determines order of fields in the form
 */
export const userSchema: SchemaField[] = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
    validation: 'name',
    placeholder: 'John',
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    required: true,
    validation: 'name',
    placeholder: 'Doe',
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: 'email',
    placeholder: 'john@example.com',
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    required: true,
    validation: 'phone',
    placeholder: '(555) 123-4567',
  },
];
