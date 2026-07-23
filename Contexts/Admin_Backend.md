# Kitchen Hearth — Admin Backend Context

## 1. Project Overview

Kitchen Hearth is a **MERN Stack** recipe application built with:

### Frontend

- React
- React Router
- Zustand
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- OpenAI API

The AI recipe generation feature already exists and is working.

The authentication system already exists and should be extended, not rewritten.

This implementation introduces a secure administration system, Role-Based Access Control (RBAC), permissions, ownership authorization, and an Admin Dashboard backend.

Do not rebuild existing application logic.

---

# 2. Existing Backend Architecture

The backend follows a modular architecture.

Reuse the existing project structure.

Recommended structure:

```text
src/
│
├── config/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
├── validators/
├── utils/
├── app.js
└── server.js
```

Only extend the existing backend.

Do not reorganize unrelated modules.

---

# 3. Objectives

Implement:

- JWT Authentication
- HttpOnly Cookie Authentication
- Role-Based Access Control (RBAC)
- Permission Middleware
- Ownership Authorization
- Admin Dashboard APIs
- Super Admin Management
- Admin Management
- User Management
- Recipe Moderation
- AI Usage Analytics
- Audit Logging
- Secure Settings Management

The implementation should remain modular, scalable, and production-ready.

---

# 4. Authentication

Reuse the existing authentication system.

Authentication includes:

- Login
- Logout
- Token Verification
- Session Validation
- Protected Routes

Every protected request must be authenticated first.

Return:

**401 Unauthorized**

when authentication fails.

Authentication should not be duplicated.

---

# 5. Authorization

Authorization must be permission-based.

Never check roles directly inside controllers.

Avoid:

```js
if (user.role === "admin")
```

Use centralized permission middleware.

Authorization Flow

```text
Request
        ↓
Authentication
        ↓
Load User
        ↓
Load Role
        ↓
Load Permissions
        ↓
Permission Middleware
        ↓
Controller
```

Return:

**403 Forbidden**

when permission is missing.

---

# 6. Role Hierarchy

Implement four roles.

- User
- Moderator
- Admin
- Super Admin

Hierarchy:

```text
Super Admin
        ↓
      Admin
        ↓
   Moderator
        ↓
       User
```

Permissions belong to Roles.

Users inherit permissions from their assigned Role.

Do not assign arbitrary permissions directly to users.

---

# 7. Permission Structure

Examples:

### User

- recipes.create
- recipes.read.own
- recipes.update.own
- recipes.delete.own
- profile.read
- profile.update

### Moderator

- recipes.read.any
- recipes.update.any
- recipes.delete.any
- reports.read
- reports.resolve
- users.read

### Admin

- dashboard.read
- users.read
- users.update
- users.suspend
- recipes.read.any
- recipes.update.any
- recipes.delete.any
- analytics.read
- audit.read

### Super Admin

- admins.create
- admins.update
- admins.delete
- users.changeRole
- permissions.manage
- system.manage
- settings.manage
- analytics.read
- audit.read

Protect every administrative endpoint using permission middleware.

---

# 8. Super Admin Management

The Super Admin is the highest privileged account.

Only the Super Admin can:

- Create Admin accounts
- Update Admin accounts
- Delete Admin accounts
- Promote User → Admin
- Demote Admin → User
- Create Moderator accounts
- Assign Roles
- Manage Permissions
- Manage System Settings

Normal registration must never create an Admin or Super Admin.

The first Super Admin should be created using a secure database seed.

Admins cannot create other Admins.

Admins cannot modify Super Admin accounts.

---

# 9. User Management

Implement administrative user management.

Features:

- Get All Users
- View User Details
- Search Users
- Filter Users
- Suspend Users
- Restore Users
- Soft Delete Users

Only Super Admin may:

- Promote Users
- Change Roles
- Create Admins

Never permanently delete user accounts.

Recommended statuses:

- Active
- Suspended
- Deleted

---

# 10. Recipe Authorization

Recipes support ownership.

Recipe Types:

Private

- Visible only to owner

Public

- Visible to everyone

Reported

- Reviewable by Moderator, Admin, and Super Admin.

Admins should not automatically gain unrestricted access to every private recipe.

---

# 11. Ownership Authorization

Ownership must always be verified.

Flow:

```text
Authenticate
        ↓
Find Resource
        ↓
Is Owner?
        ↓
Yes → Continue
        ↓
No
        ↓
Has *.any Permission?
        ↓
Allow or Reject
```

Apply ownership to:

- Recipes
- Profiles
- Meal Plans

Use `.own` and `.any` permission patterns.

---

# 12. Audit Logging

Log security-sensitive actions only.

Examples:

- Admin Created
- Admin Deleted
- User Suspended
- User Restored
- User Deleted
- Role Changed
- Recipe Deleted
- Settings Updated
- Permission Updated

Each audit log should include:

- Action
- Actor
- Target
- Previous Value
- New Value
- Timestamp

Do not log normal page views.

---

# 13. Admin APIs

Create dedicated administrative endpoints.

```text
/api/v1/admin/dashboard

/api/v1/admin/users

/api/v1/admin/users/:id

/api/v1/admin/admins

/api/v1/admin/admins/:id

/api/v1/admin/roles

/api/v1/admin/permissions

/api/v1/admin/recipes

/api/v1/admin/analytics

/api/v1/admin/audit-logs

/api/v1/admin/settings
```

Every endpoint must be protected.

---

# 14. Middleware

Reuse the existing middleware where possible.

Add:

- Authorization Middleware
- Ownership Middleware
- Validation Middleware
- Error Middleware

Controllers should only coordinate requests.

Business logic belongs inside Services.

---

# 15. Validation

Use Zod.

Validate:

- Request Body
- Route Parameters
- Query Parameters

Reject invalid requests before reaching controllers.

---

# 16. Database Models

Reuse existing models.

Add only when necessary.

Recommended models:

```text
User

Role

Permission

Recipe

AuditLog
```

Relationships:

```text
User
      ↓
Role
      ↓
Permissions
```

Do not duplicate permissions inside user documents.

---

# 17. Security Rules

Implement:

- JWT Authentication
- HttpOnly Cookies
- Password Hashing
- RBAC
- Permission Middleware
- Ownership Validation
- Input Validation
- Rate Limiting
- Secure Error Responses

The backend is the source of truth.

Never trust frontend permissions.

---

# 18. Folder Structure

Recommended additions:

```text
src/

controllers/
    admin.controller.js

services/
    admin.service.js
    role.service.js
    permission.service.js
    analytics.service.js

models/
    Role.js
    Permission.js
    AuditLog.js

routes/
    admin.routes.js

middlewares/
    authorize.middleware.js
    ownership.middleware.js

validators/
    admin.validator.js
```

Reuse existing modules wherever possible.

---

# 19. Implementation Rules

Before implementation:

- Inspect the existing backend architecture.
- Reuse existing authentication.
- Reuse existing JWT middleware.
- Reuse existing validation.
- Reuse existing error handling.
- Keep controllers thin.
- Move business logic into services.
- Protect every admin endpoint.
- Do not rewrite AI generation.
- Do not duplicate authentication.
- Do not install unnecessary dependencies.
- Follow existing project conventions.

Only modify files required for the Admin system.

---

# 20. Admin Dashboard Modules

The backend should support the following dashboard modules.

## Dashboard

Provide APIs for:

- Total Users
- Total Recipes
- Total Admins
- AI Requests Today
- Total AI Requests
- Failed AI Requests
- Active Users
- Recent Users
- Recent Recipes
- Recent Activity

Use real database statistics.

Do not generate fake analytics.

---

## Users

Provide APIs for:

- Get Users
- Search Users
- Filter Users
- Suspend User
- Restore User
- Soft Delete User
- View User Details

---

## Admin Management

**Super Admin only**

Provide APIs for:

- Get Admins
- Create Admin
- Update Admin
- Delete Admin
- Change Admin Role

Admins cannot create or delete Admins.

---

## Roles & Permissions

**Super Admin only**

Provide APIs for:

- Get Roles
- Get Permissions
- Assign Role
- Update Role Permissions

---

## Recipes

Provide APIs for:

- Get Recipes
- Search Recipes
- Filter Recipes
- Reported Recipes
- Delete Public Recipe

---

## AI Usage

Provide analytics APIs for:

- Total Requests
- Requests Today
- Failed Requests
- Average Response Time
- Most Active Users

---

## Audit Logs

Provide APIs for:

- Get Logs
- Search Logs
- Filter Logs

---

## Settings

**Super Admin only**

Provide APIs for:

- Application Settings
- AI Configuration
- Security Settings
- Rate Limits

---

# 21. Acceptance Criteria

The implementation is complete when:

- Existing AI recipe generation continues working.
- Existing authentication remains functional.
- JWT authentication is reused.
- Role-Based Access Control is fully implemented.
- Permission middleware protects all admin APIs.
- Super Admin is the only role that can create or manage Admin accounts.
- Ownership authorization is enforced.
- Audit logs record sensitive administrative actions.
- Dashboard APIs return real application statistics.
- Admin dashboard modules are fully supported by backend APIs.
- Controllers remain thin.
- Business logic resides in services.
- Existing architecture is preserved.
- No existing functionality is unnecessarily rewritten.
- The backend is modular, secure, scalable, and production-ready.
