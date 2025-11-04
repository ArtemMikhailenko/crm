# Backend Requirements for User Details Page

## Current Endpoint Status

### ✅ Already Implemented (Assumed)
- `GET /users/:id` - Retrieve single user details

### 📝 Required Response Format

The `GET /users/:id` endpoint should return a user object with the following structure:

```typescript
{
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  phone?: string;
  avatarUrl?: string;
  status: string; // e.g., "ACTIVE", "INACTIVE"
  timezone?: string;
  companyId?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  company?: {
    id: string;
    name: string;
    type: 'CUSTOMER' | 'SUBCONTRACTOR' | 'INTERNAL';
  };
  roles?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}
```

### ✅ Update Endpoint (Already Implemented)
- `PATCH /users/:id` - Update user information

### Required Request Body for Update:
```typescript
{
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  timezone?: string;
  companyId?: string;
  status?: string;
}
```

**Note:** Email updates are not allowed through this endpoint for security reasons.

### Response:
Should return the updated user object in the same format as GET /users/:id

## Frontend Implementation

### Features Implemented:
1. **User Details Display**
   - Avatar with first letter of displayName
   - Full name, email, phone
   - Company information with type badge
   - Role badges
   - Created/updated timestamps
   - Last login information
   - Timezone
   - User ID

2. **Edit Functionality**
   - Three-dot menu button in header opens edit modal
   - Edit form with validation:
     - First name (required)
     - Last name (required)
     - Display name (required)
     - Phone (optional)
     - Company selection (optional, filtered to SUBCONTRACTOR type)
     - Email field is read-only (cannot be changed)
   - Form validation using Zod schema
   - Success/error toast notifications
   - Automatic data refresh after update

3. **Loading States**
   - Skeleton loaders while fetching data
   - Disabled submit button during update
   - Loading spinner on submit button

4. **Error Handling**
   - Display error message if user not found
   - API error handling with user-friendly messages

## Testing Checklist

- [ ] GET /users/:id returns correct user data with all fields
- [ ] GET /users/:id includes company object when user has companyId
- [ ] GET /users/:id includes roles array
- [ ] PATCH /users/:id successfully updates user fields
- [ ] PATCH /users/:id returns updated user object
- [ ] PATCH /users/:id validates required fields
- [ ] PATCH /users/:id rejects email updates
- [ ] Date fields are properly formatted (ISO 8601)
- [ ] Company type enum matches: CUSTOMER, SUBCONTRACTOR, or INTERNAL

## API Endpoints Used

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | /users/:id | Fetch single user | ✅ Required |
| PATCH | /users/:id | Update user | ✅ Required |
| GET | /companies?type=SUBCONTRACTOR | Get companies for dropdown | ✅ Implemented |

## Notes

- Frontend uses React Query for automatic cache invalidation
- After successful update, both `/users` and `/user/:id` queries are invalidated
- Email field is intentionally read-only in the edit form
- Company selection is filtered to show only SUBCONTRACTOR type companies
- User status badge shows green for "ACTIVE", gray for other statuses
