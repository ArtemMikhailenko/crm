# Backend Requirements for Extended User Profile

## Overview
Для полноценного редактирования профиля пользователя нужно добавить дополнительные поля и эндпоинты.

## Required Database Schema Extensions

### 1. User Table - Additional Fields

```typescript
interface User {
  // ... existing fields (id, email, displayName, etc.)
  
  // Work Rates (new)
  ratePerHour?: number;
  ratePerLinearMeter?: number;
  ratePerM2?: number;
  
  // Work Types (new) - can be array or separate table
  workTypes?: string[]; // e.g., ["Plumbing", "Spackle", "Tile"]
  
  // Schedule (new) - can be JSON field
  workSchedule?: {
    monday?: { start: string, end: string };
    tuesday?: { start: string, end: string };
    wednesday?: { start: string, end: string };
    thursday?: { start: string, end: string };
    friday?: { start: string, end: string };
    saturday?: { start: string, end: string };
    sunday?: { start: string, end: string };
  };
}
```

### 2. User Contacts Table (new)

```sql
CREATE TABLE user_contacts (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  email VARCHAR,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

TypeScript interface:
```typescript
interface UserContact {
  id: string;
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. User Vacations Table (new)

```sql
CREATE TABLE user_vacations (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

TypeScript interface:
```typescript
interface UserVacation {
  id: string;
  userId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. User Alerts Table (new)

```sql
CREATE TABLE user_alerts (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  alert_type VARCHAR NOT NULL, -- e.g., 'task_assigned', 'deadline_approaching'
  is_enabled BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

TypeScript interface:
```typescript
interface UserAlert {
  id: string;
  userId: string;
  alertType: string;
  isEnabled: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Required API Endpoints

### User Rates & Schedule

#### Update User Rates
```
PATCH /users/:id/rates
```

Request Body:
```json
{
  "ratePerHour": 77,
  "ratePerLinearMeter": 48,
  "ratePerM2": 69,
  "workTypes": ["Plumbing", "Spackle", "Tile"],
  "workSchedule": {
    "monday": { "start": "08:00", "end": "18:00" },
    "tuesday": { "start": "08:00", "end": "18:00" },
    "wednesday": { "start": "08:00", "end": "18:00" },
    "thursday": { "start": "08:00", "end": "18:00" },
    "friday": { "start": "08:00", "end": "18:00" },
    "saturday": { "start": "08:00", "end": "18:00" }
  }
}
```

Response:
```json
{
  "id": "user_id",
  "ratePerHour": 77,
  "ratePerLinearMeter": 48,
  "ratePerM2": 69,
  "workTypes": ["Plumbing", "Spackle", "Tile"],
  "workSchedule": { ... }
}
```

### User Contacts

#### Get User Contacts
```
GET /users/:id/contacts
```

Response:
```json
{
  "data": [
    {
      "id": "contact_id",
      "userId": "user_id",
      "name": "John Doe",
      "phone": "+1 555-0100",
      "email": "john@example.com",
      "isPrimary": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Contact
```
POST /users/:id/contacts
```

Request Body:
```json
{
  "name": "John Doe",
  "phone": "+1 555-0100",
  "email": "john@example.com",
  "isPrimary": false
}
```

#### Update Contact
```
PATCH /users/:userId/contacts/:contactId
```

#### Delete Contact
```
DELETE /users/:userId/contacts/:contactId
```

### User Vacations

#### Get User Vacations
```
GET /users/:id/vacations
```

Response:
```json
{
  "data": [
    {
      "id": "vacation_id",
      "userId": "user_id",
      "title": "Summer Vacation",
      "startDate": "2025-06-16",
      "endDate": "2025-06-30",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Vacation
```
POST /users/:id/vacations
```

Request Body:
```json
{
  "title": "Summer Vacation",
  "startDate": "2025-06-16",
  "endDate": "2025-06-30"
}
```

#### Update Vacation
```
PATCH /users/:userId/vacations/:vacationId
```

#### Delete Vacation
```
DELETE /users/:userId/vacations/:vacationId
```

### User Alerts

#### Get User Alerts
```
GET /users/:id/alerts
```

Response:
```json
{
  "data": [
    {
      "id": "alert_id",
      "userId": "user_id",
      "alertType": "task_assigned",
      "isEnabled": true,
      "description": "Notify when a new task is assigned",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Update Alert
```
PATCH /users/:userId/alerts/:alertId
```

Request Body:
```json
{
  "isEnabled": true,
  "description": "Updated description"
}
```

#### Bulk Update Alerts
```
PATCH /users/:id/alerts
```

Request Body:
```json
{
  "alerts": [
    { "id": "alert_1", "isEnabled": true },
    { "id": "alert_2", "isEnabled": false }
  ]
}
```

## Updated GET /users/:id Response

Расширенный ответ должен включать все новые поля:

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1 555-0100",
  "status": "ACTIVE",
  "timezone": "Europe/Kiev",
  "companyId": "company_id",
  "company": {
    "id": "company_id",
    "name": "Company Name",
    "type": "SUBCONTRACTOR"
  },
  "roles": [...],
  
  // New fields
  "ratePerHour": 77,
  "ratePerLinearMeter": 48,
  "ratePerM2": 69,
  "workTypes": ["Plumbing", "Spackle", "Tile"],
  "workSchedule": {
    "monday": { "start": "08:00", "end": "18:00" },
    "tuesday": { "start": "08:00", "end": "18:00" },
    "wednesday": { "start": "08:00", "end": "18:00" },
    "thursday": { "start": "08:00", "end": "18:00" },
    "friday": { "start": "08:00", "end": "18:00" },
    "saturday": { "start": "08:00", "end": "18:00" }
  },
  "contacts": [...],
  "vacations": [...],
  "alerts": [...],
  
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Frontend Implementation Plan

1. **Update User Type** - добавить новые поля в `src/shared/types/user.ts`
2. **Create Services** - создать сервисы для contacts, vacations, alerts
3. **Create Hooks** - React Query хуки для CRUD операций
4. **Create Modal Forms** - формы редактирования для каждой карточки
5. **Wire up buttons** - подключить кнопки "три точки" к модалкам

## Priority

**High Priority** (нужно сразу):
- User rates and schedule (PATCH /users/:id/rates)
- User contacts CRUD

**Medium Priority**:
- User vacations CRUD

**Low Priority**:
- User alerts management
