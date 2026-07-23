const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealplan.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createMealPlanSchema } = require('../validators/mealplan.validator');

// GET /api/v1/meal-plans
router.get('/', authMiddleware, mealPlanController.getMealPlans);

// POST /api/v1/meal-plans
router.post('/', authMiddleware, validate(createMealPlanSchema), mealPlanController.addMealPlan);

// DELETE /api/v1/meal-plans/:id
router.delete('/:id', authMiddleware, mealPlanController.deleteMealPlan);

module.exports = router;
