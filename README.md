# User Management System - CRUD Application

A production-ready React + TypeScript CRUD application featuring schema-driven forms, real-time validation, and complete user management operations.

## Features

### Core Features
- **Schema-Driven Form System**: Add new fields with minimal code changes through centralized configuration
- **Full CRUD Operations**: Create, Read, Update, Delete operations for user management
- **Real-Time Validation**: Inline field validation with instant feedback
- **Responsive Design**: Mobile-first approach with responsive grid layouts
- **Mock API Integration**: Simulated API with 500ms network latency for realistic behavior
- **Error Handling**: Comprehensive error messages and recovery strategies
- **Type Safety**: Full TypeScript implementation with zero `any` types

### Advanced Features
- **Form Mode Switching**: Seamless transitions between create and edit modes
- **Delete Confirmation**: Safety confirmation dialog before destructive operations
- **Loading States**: Visual feedback during all async operations
- **User Count Display**: Shows total user count and last updated information
- **Search/Filter**: User list displays with responsive grid layout
- **Keyboard Shortcuts**: ESC to cancel, Enter to submit forms
- **Form Field Focus Management**: Proper focus handling for accessibility

## Tech Stack

- **React 19.2+**: Latest React with hooks and client components
- **TypeScript**: Complete type safety with strict mode
- **Next.js 16**: App Router with modern server/client architecture
- **TailwindCSS**: Utility-first CSS for responsive design
- **React Hooks**: useState, useEffect, useCallback for state management
- **Custom Hooks**: useUsers and useUserCRUD for encapsulated logic

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd user-management-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npx jest --watch

# Run with coverage report
npx jest --coverage
```

## Project Structure

```
user-management-app/
├── app/                        # Next.js App Router
│   ├── globals.css             # Global styles and Tailwind config
│   ├── layout.tsx              # Root layout with Toaster
│   └── page.tsx                # Home page
├── src/
│   ├── __tests__/              # Unit tests
│   │   ├── api.test.ts         # Mock API CRUD tests
│   │   ├── FormField.test.tsx  # FormField component tests
│   │   ├── schema.test.ts      # Schema config tests
│   │   └── validation.test.ts  # Validation utility tests
│   ├── components/             # React components
│   │   ├── App.tsx             # Main application container
│   │   ├── ConfirmDialog.tsx   # Delete confirmation modal
│   │   ├── FormField.tsx       # Reusable form field component
│   │   ├── UserCard.tsx        # User display card
│   │   ├── UserForm.tsx        # Schema-driven user form
│   │   └── UserList.tsx        # User list with grid layout
│   ├── config/
│   │   └── userSchema.ts       # ⭐ Form field configuration (extensibility point)
│   ├── hooks/
│   │   ├── useUserCRUD.ts      # CRUD operations hook
│   │   └── useUsers.ts         # User data fetching hook
│   ├── services/
│   │   └── api.ts              # Mock API service layer
│   ├── types/
│   │   └── user.ts             # TypeScript interfaces
│   └── utils/
│       └── validation.ts       # Schema-driven validation utilities
├── jest.config.ts              # Jest configuration
├── jest.setup.ts               # Testing Library setup
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── package.json
```

## How to Add New Fields (Extensibility Guide)

The application uses a **schema-driven architecture** that makes adding new fields extremely simple. Here's how to add a "Date of Birth" field as an example:

### Step 1: Update the TypeScript Interface

In `src/types/user.ts`, add the new field to both interfaces:

```typescript
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;  // ← Add here
  createdAt: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;  // ← Add here
}
```

### Step 2: Add to Schema Configuration

In `src/config/userSchema.ts`, add a new entry to the array:

```typescript
export const userSchema: SchemaField[] = [
  // ... existing fields ...
  {
    name: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    required: false,
    validation: 'date',
    placeholder: 'YYYY-MM-DD',
  },
];
```

### Step 3 (Optional): Add Custom Validation

If the field needs special validation, add a validator in `src/utils/validation.ts`:

```typescript
export const validateDate = (value: string): string => {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Please enter a valid date';
  return '';
};
```

Then add the case to `validateField()`:

```typescript
case 'date':
  return validateDate(value);
```

**That's it!** The form rendering, validation, initial state, and API layer will automatically handle the new field with zero changes to any component code.

### Why This Works

| Layer | Auto-adapts? | How |
|-------|-------------|-----|
| **Form rendering** | ✅ | `UserForm` iterates `userSchema` to render `FormField` components |
| **Initial form state** | ✅ | `getEmptyFormData()` builds defaults from schema |
| **Validation** | ✅ | `validateFormData()` iterates schema and routes to validators |
| **Type safety** | ✅ | `SchemaField.name` is typed as `keyof UserFormData` |

## Mock API

The application uses an in-memory mock API (`src/services/api.ts`) that simulates real network behavior:

| Operation | Simulated Endpoint | Delay | Features |
|-----------|-------------------|-------|----------|
| List Users | `GET /api/users` | 500ms | Returns all users |
| Create User | `POST /api/users` | 500ms | Duplicate email check, required field validation |
| Update User | `PUT /api/users/:id` | 500ms | Not-found check, email uniqueness |
| Delete User | `DELETE /api/users/:id` | 500ms | Not-found check |

### Connecting to a Real API

Replace the mock functions in `src/services/api.ts` with actual `fetch()` calls:

```typescript
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  const res = await fetch('/api/users');
  const data = await res.json();
  return { success: true, data };
};
```

## Design Decisions

1. **Schema-Driven Architecture**: All form fields are defined in a single configuration file (`userSchema.ts`). The form component, validation, and initial state are all derived from this schema, ensuring zero-touch extensibility.

2. **Custom Hooks for Separation of Concerns**: `useUsers` handles data fetching while `useUserCRUD` manages mutation operations with independent loading states per operation type (creating, updating, deleting).

3. **TypeScript Throughout**: Every component, hook, utility, and type is fully typed. Props interfaces, API response generics, and validation error maps provide compile-time safety.

4. **Toast Notifications**: Uses Sonner for success/error feedback on all CRUD operations, providing clear user feedback without cluttering the UI.

5. **Tailwind CSS v4**: Uses the latest CSS-first configuration approach with `@theme` and `@layer` directives for a clean, maintainable styling system.

6. **Responsive Layout**: Two-column layout on desktop (form + list), single column on mobile. Sticky header and form panel for better UX.

7. **Accessibility**: ARIA attributes on form fields (`aria-invalid`, `aria-describedby`), alert dialogs (`role="alertdialog"`, `aria-modal`), and interactive elements.

8. **Comprehensive Testing**: Jest unit tests cover validation logic, API service CRUD operations, schema configuration integrity, and component rendering/interaction.

## Assumptions

- The mock API uses an in-memory array; data resets on page refresh (simulates backend behavior).
- Phone validation accepts US format (10+ digits) and international format with `+` prefix.
- Email validation uses a simplified RFC 5322 regex pattern.
- The application is designed for deployment on Vercel/Netlify with zero configuration.
- No authentication is implemented (out of scope for this task).

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Vercel auto-detects Next.js — click **Deploy**

### Netlify

1. Push your code to GitHub
2. Import on [netlify.com](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `.next`

## License

MIT
#   u s e r - m a n a g e m e n t - a p p  
 