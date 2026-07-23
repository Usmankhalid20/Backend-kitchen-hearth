# Kitchen Hearth — Backend Context

## 1. Project Overview

Kitchen Hearth is a recipe application built with:

- Node.js
- Express
- MongoDB
- Mongoose
- React frontend
- OpenAI API

The AI recipe generation feature is already working.

The backend must preserve the existing AI recipe generation functionality.

Do not rebuild or redesign the existing AI generation flow unless explicitly requested.

The next priorities are:

1. Authentication
2. Protecting the existing AI recipe generation
3. Saving generated recipes
4. Recipe management
5. Meal planning

---

# 2. Existing AI Feature

The AI recipe generation is already working.

Current flow:

User enters a cooking request
↓
Frontend sends request to backend
↓
Backend calls OpenAI
↓
AI returns recipe data
↓
Frontend displays the generated recipe

Example:

"I want to make chicken tikka"

The AI can generate:

- Recipe name
- Description
- Ingredients
- Quantities
- Cooking time
- Difficulty
- Servings
- Instructions

Preserve the existing functionality.

Do not rewrite the existing OpenAI logic unnecessarily.

Do not change the existing AI response format unless required.

---

# 3. Architecture

Use a modular monolith.

Frontend:

React
↓
Axios
↓
Express API
↓
Controllers
↓
Services
↓
Mongoose Models
↓
MongoDB

AI flow:

Frontend
↓
POST /api/v1/ai/generate
↓
Authentication Middleware
↓
AI Controller
↓
Existing AI Service
↓
OpenAI API
↓
Recipe Response
↓
Frontend

---

# 4. Backend Structure

Use a structure similar to:

src/
│
├── config/
│ ├── database.js
│ └── env.js
│
├── controllers/
│ ├── auth.controller.js
│ ├── ai.controller.js
│ └── recipe.controller.js
│
├── services/
│ ├── auth.service.js
│ ├── ai.service.js
│ └── recipe.service.js
│
├── models/
│ ├── User.js
│ └── Recipe.js
│
├── routes/
│ ├── auth.routes.js
│ ├── ai.routes.js
│ └── recipe.routes.js
│
├── middlewares/
│ ├── auth.middleware.js
│ ├── error.middleware.js
│ └── validate.middleware.js
│
├── validators/
│ ├── auth.validator.js
│ └── ai.validator.js
│
├── utils/
│ ├── ApiError.js
│ └── asyncHandler.js
│
├── app.js
└── server.js
