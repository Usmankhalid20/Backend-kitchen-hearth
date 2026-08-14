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
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:8080',
  `http://localhost:${env.PORT}`,
  `http://127.0.0.1:${env.PORT}`
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
    // Allow requests with no origin, explicit allowedOrigins, or any HTTP/HTTPS origin (e.g. EC2 public IP)
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://') || origin.startsWith('https://')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

// Health Check / Keep-Alive GET Routes
app.get(['/health', '/api/v1/health'], (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    message: 'Server is healthy and active',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/meal-plans', mealPlanRoutes);
app.use('/api/v1/admin', adminRoutes);

// Serve static frontend assets from backend/public
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// SPA Catch-All Route for React Router (Express 5 safe)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !/\.[a-zA-Z0-9]+$/.test(req.path)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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
