const recipeService = require('../services/recipe.service');
const asyncHandler = require('../utils/asyncHandler');

exports.saveRecipe = asyncHandler(async (req, res) => {
    const savedRecipe = await recipeService.saveRecipe(req.body, req.user.id);

    res.status(201).json({
        success: true,
        data: savedRecipe
    });
});

exports.getUserRecipes = asyncHandler(async (req, res) => {
    const recipes = await recipeService.getUserRecipes(req.user.id);
    res.json({ success: true, data: recipes });
});

exports.getRecipeById = asyncHandler(async (req, res) => {
    const recipe = await recipeService.getRecipeById(req.params.id, req.user.id);
    res.json({ success: true, data: recipe });
});

exports.deleteUserRecipe = asyncHandler(async (req, res) => {
    await recipeService.deleteUserRecipe(req.params.id, req.user.id);
    res.json({ success: true, message: 'Recipe deleted successfully' });
});

exports.toggleFavorite = asyncHandler(async (req, res) => {
    const recipe = await recipeService.toggleFavorite(req.params.id, req.user.id);
    res.json({ success: true, data: recipe });
});
