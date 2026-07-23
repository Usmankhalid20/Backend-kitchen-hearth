# Kitchen Hearth — User Workspace Backend Context

## 1. Purpose

The User Workspace backend provides authenticated users with the ability to:

- Generate recipes using the existing AI Assistant.
- Save generated recipes.
- View their own recipes.
- View individual recipe details.
- Update their own recipes where supported.
- Delete their own recipes.
- Favorite recipes.
- Manage meal plans.
- Manage their profile.

The backend must enforce authentication, ownership, validation, and authorization.

The frontend must never be treated as the security layer.

---

# 2. Backend Technology

Use the existing backend stack:

- Node.js
- Express.js
- MongoDB
- Mongoose
- OpenAI API
- Zod
- JWT
- HttpOnly Cookies
- bcryptjs
- dotenv
- CORS

Use ES Modules if the existing project uses ES Modules.

Do not introduce a new backend framework.

Do not migrate from MongoDB to PostgreSQL.

---

# 3. Core User Flow

The main backend flow is:

User authenticates
↓
JWT is stored using the existing authentication strategy
↓
User accesses protected endpoint
↓
Authentication middleware verifies the user
↓
Controller receives request
↓
Validation is performed
↓
Service performs business logic
↓
Database operation occurs
↓
Consistent API response is returned

---

# 4. Existing AI Assistant

The AI Assistant and AI recipe generation already exist.

Do not rewrite the existing AI generation functionality unless explicitly requested.

The existing AI flow is:

Frontend
↓
AI Recipe API
↓
Authentication Middleware
↓
Validation
↓
AI Service
↓
OpenAI API
↓
Recipe Result
↓
Frontend

The User Workspace backend must integrate with the existing AI functionality.

Do not create a second AI generation endpoint unnecessarily.

---

# 5. Recipe Saving Flow

The expected flow is:

User generates a recipe
↓
AI Assistant displays the recipe
↓
User clicks "Save Recipe"
↓
Frontend sends recipe data to backend
↓
Backend authenticates user
↓
Backend validates request
↓
Backend attaches current user as owner
↓
Recipe is saved to MongoDB
↓
Recipe is returned to frontend

The owner must come from the authenticated user.

Do not trust a client-provided userId.

Bad:

```text
POST /recipes

{
  "userId": "some-user-id"
}
```
