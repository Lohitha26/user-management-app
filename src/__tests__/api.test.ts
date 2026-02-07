/**
 * Mock API Service Unit Tests
 *
 * Tests all CRUD operations in the mock API layer.
 * Verifies correct responses, error handling, duplicate detection, and edge cases.
 */

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserCount,
  __resetUsersForTest,
} from '@/src/services/api';

// Reset the in-memory database before each test to ensure isolation
beforeEach(() => {
  __resetUsersForTest();
});

// ---------------------------------------------------------------------------
// getUsers (Read)
// ---------------------------------------------------------------------------
describe('getUsers', () => {
  it('returns the default seed users', async () => {
    const response = await getUsers();
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data!.length).toBe(3);
  });

  it('returns a copy of the data (not a reference)', async () => {
    const r1 = await getUsers();
    const r2 = await getUsers();
    expect(r1.data).not.toBe(r2.data);
  });
});

// ---------------------------------------------------------------------------
// createUser (Create)
// ---------------------------------------------------------------------------
describe('createUser', () => {
  const validUser = {
    firstName: 'Dave',
    lastName: 'Wilson',
    email: 'dave@example.com',
    phone: '(555) 999-0000',
  };

  it('creates a user and returns it with an id and createdAt', async () => {
    const response = await createUser(validUser);
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data!.firstName).toBe('Dave');
    expect(response.data!.id).toBeTruthy();
    expect(response.data!.createdAt).toBeTruthy();
  });

  it('increases the total user count', async () => {
    await createUser(validUser);
    const count = await getUserCount();
    expect(count).toBe(4);
  });

  it('rejects creation when required fields are missing', async () => {
    const response = await createUser({
      firstName: '',
      lastName: 'Wilson',
      email: 'dave@example.com',
      phone: '(555) 999-0000',
    });
    expect(response.success).toBe(false);
    expect(response.error).toBeTruthy();
  });

  it('rejects duplicate email addresses', async () => {
    const response = await createUser({
      firstName: 'Duplicate',
      lastName: 'User',
      email: 'alice@example.com', // already exists in seed data
      phone: '(555) 111-2222',
    });
    expect(response.success).toBe(false);
    expect(response.error).toContain('already exists');
  });
});

// ---------------------------------------------------------------------------
// updateUser (Update)
// ---------------------------------------------------------------------------
describe('updateUser', () => {
  it('updates an existing user', async () => {
    const response = await updateUser('1', {
      firstName: 'Alicia',
      lastName: 'Johnson',
      email: 'alice@example.com',
      phone: '(555) 123-4567',
    });
    expect(response.success).toBe(true);
    expect(response.data!.firstName).toBe('Alicia');
  });

  it('returns error for non-existent user', async () => {
    const response = await updateUser('999', {
      firstName: 'Ghost',
      lastName: 'User',
      email: 'ghost@example.com',
      phone: '(555) 000-0000',
    });
    expect(response.success).toBe(false);
    expect(response.error).toContain('not found');
  });

  it('rejects update if email is taken by another user', async () => {
    const response = await updateUser('1', {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'bob@example.com', // belongs to user id=2
      phone: '(555) 123-4567',
    });
    expect(response.success).toBe(false);
    expect(response.error).toContain('already in use');
  });
});

// ---------------------------------------------------------------------------
// deleteUser (Delete)
// ---------------------------------------------------------------------------
describe('deleteUser', () => {
  it('deletes an existing user', async () => {
    const response = await deleteUser('1');
    expect(response.success).toBe(true);

    const count = await getUserCount();
    expect(count).toBe(2);
  });

  it('returns error for non-existent user', async () => {
    const response = await deleteUser('999');
    expect(response.success).toBe(false);
    expect(response.error).toContain('not found');
  });
});

// ---------------------------------------------------------------------------
// getUserCount
// ---------------------------------------------------------------------------
describe('getUserCount', () => {
  it('returns correct count after operations', async () => {
    expect(await getUserCount()).toBe(3);

    await createUser({
      firstName: 'New',
      lastName: 'User',
      email: 'new@example.com',
      phone: '1234567890',
    });
    expect(await getUserCount()).toBe(4);

    await deleteUser('1');
    expect(await getUserCount()).toBe(3);
  });
});
