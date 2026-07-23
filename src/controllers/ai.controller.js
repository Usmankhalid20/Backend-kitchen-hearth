const aiService = require('../services/ai.service');
const recipeService = require('../services/recipe.service');
const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');

exports.generateRecipe = asyncHandler(async (req, res) => {
    // Check and increment DB limit. Will throw ApiError(429) if limit exceeded.
    await userService.checkAndIncrementAiLimit(req.user.id);

    // req.body is validated by validate middleware in routes
    const { prompt } = req.body;
    
    // 1. Generate recipe from AI Service
    const recipeData = await aiService.generateRecipe(prompt);
    
    // 2. Save recipe to DB via Recipe Service, bound to user
    const savedRecipe = await recipeService.saveRecipe(recipeData, req.user.id);
    
    // 3. Return saved recipe
    res.status(200).json({
        success: true,
        data: savedRecipe
    });
});
