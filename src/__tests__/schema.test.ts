/**
 * Schema Configuration Unit Tests
 *
 * Verifies the userSchema config is well-formed and that the extensibility
 * contract (schema-driven rendering) holds.
 */

import { userSchema } from '@/src/config/userSchema';

describe('userSchema', () => {
  it('contains all four required fields', () => {
    const names = userSchema.map((f) => f.name);
    expect(names).toContain('firstName');
    expect(names).toContain('lastName');
    expect(names).toContain('email');
    expect(names).toContain('phone');
  });

  it('every field has a label and type', () => {
    userSchema.forEach((field) => {
      expect(field.label).toBeTruthy();
      expect(['text', 'email', 'tel', 'date']).toContain(field.type);
    });
  });

  it('every required field has a validation rule', () => {
    userSchema
      .filter((f) => f.required)
      .forEach((field) => {
        expect(field.validation).toBeTruthy();
      });
  });

  it('field order matches expected rendering order', () => {
    expect(userSchema[0].name).toBe('firstName');
    expect(userSchema[1].name).toBe('lastName');
    expect(userSchema[2].name).toBe('email');
    expect(userSchema[3].name).toBe('phone');
  });
});
