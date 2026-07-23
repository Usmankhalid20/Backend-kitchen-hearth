const mealPlanService = require('../services/mealplan.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getMealPlans = asyncHandler(async (req, res) => {
    const mealPlans = await mealPlanService.getMealPlans(req.user.id);
    res.json({ success: true, data: mealPlans });
});

exports.addMealPlan = asyncHandler(async (req, res) => {
    const { recipeId, date } = req.body;
    const mealPlan = await mealPlanService.addMealPlan(req.user.id, recipeId, date);
    
    res.status(201).json({
        success: true,
        data: mealPlan
    });
});

exports.deleteMealPlan = asyncHandler(async (req, res) => {
    await mealPlanService.deleteMealPlan(req.params.id, req.user.id);
    res.json({ success: true, message: 'Meal plan deleted successfully' });
});
