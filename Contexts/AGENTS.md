# Backend Rules

## Stack

- Node.js
- Express
- MongoDB
- OpenAI SDK
- Zod
- bcryptjs
- jsonwebtoken
- cookie-parser
- cors
- dotenv
- helmet
- express-rate-limit

## Architecture

Request
→ Route
→ Middleware
→ Controller
→ Service
→ Repository
→ MongoDB

## Responsibilities

Routes:

- Define endpoints
- Attach middleware
- Call controllers

Controllers:

- Handle HTTP requests and responses
- Remain thin

Services:

- Contain business logic
- Handle OpenAI integration

Repositories:

- Contain MongoDB queries

Validators:

- Validate request data and AI responses

## Rules

- Never expose secrets.
- Validate AI output before using it.
- Use centralized error handling.
- Do not automatically save every AI-generated recipe.
- Do not add microservices.
- Do not add Redis or queues without a real requirement.
- Do not modify unrelated features.

## AI Flow

Frontend
→ POST /api/v1/ai/generate
→ Controller
→ AI Service
→ OpenAI API
→ Zod validation
→ Frontend

The OpenAI API key must only exist on the backend.
