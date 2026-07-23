const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// POST /api/v1/recipes
router.post('/', authMiddleware, recipeController.saveRecipe);

// GET /api/v1/recipes
router.get('/', authMiddleware, recipeController.getUserRecipes);

// GET /api/v1/recipes/:id
router.get('/:id', authMiddleware, recipeController.getRecipeById);

// DELETE /api/v1/recipes/:id
router.delete('/:id', authMiddleware, recipeController.deleteUserRecipe);

// PATCH /api/v1/recipes/:id/favorite
router.patch('/:id/favorite', authMiddleware, recipeController.toggleFavorite);

module.exports = router;
