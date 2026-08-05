const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const env = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const aiRoutes = require('./routes/ai.routes');
const recipeRoutes = require('./routes/recipe.routes');
const mealPlanRoutes = require('./routes/mealplan.routes');
const adminRoutes = require('./routes/admin.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Global Middlewares
app.use(helmet());

// CORS configuration supporting credentials, custom headers, and dynamic origins
const allowedOrigins = [
  'https://kitchen-hearth.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

if (env.CLIENT_ORIGIN) {
  const origins = env.CLIENT_ORIGIN.split(',').map(o => o.trim());
  origins.forEach(origin => {
    if (!allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin);
    }
  });
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, postman, or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/meal-plans', mealPlanRoutes);
app.use('/api/v1/admin', adminRoutes);

// Centralized Error Handling
app.use(errorMiddleware);

module.exports = app;
