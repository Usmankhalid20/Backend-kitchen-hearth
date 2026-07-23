const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const aiRoutes = require('./routes/ai.routes');
const recipeRoutes = require('./routes/recipe.routes');
const mealPlanRoutes = require('./routes/mealplan.routes');
const adminRoutes = require('./routes/admin.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
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
