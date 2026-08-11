const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const env = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const aiRoutes = require('./routes/ai.routes');
const recipeRoutes = require('./routes/recipe.routes');
const mealPlanRoutes = require('./routes/mealplan.routes');
const adminRoutes = require('./routes/admin.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Global Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false
}));

// CORS configuration supporting credentials, custom headers, and dynamic origins
const allowedOrigins = [
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

app.use(cookieParser());
app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/meal-plans', mealPlanRoutes);
app.use('/api/v1/admin', adminRoutes);

// Serve static frontend assets from backend/public
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// SPA Catch-All Route for React Router (Express 5 safe)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !/\.[a-zA-Z0-9]+$/.test(req.path)) {
    return res.sendFile(path.join(publicPath, 'index.html'), (err) => {
      if (err) {
        next(err);
      }
    });
  }
  next();
});

// Centralized Error Handling
app.use(errorMiddleware);

module.exports = app;
