const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');
const ApiError = require('../utils/ApiError');

exports.getMealPlans = async (userId) => {
  return await MealPlan.find({ user: userId })
    .populate('recipe')
    .sort({ date: 1 });
};

exports.addMealPlan = async (userId, recipeId, dateStr) => {
  // Verify recipe exists and belongs to user or is public
  const recipe = await Recipe.findOne({ _id: recipeId, user: userId });
  if (!recipe) {
    throw new ApiError(404, 'Recipe not found or unauthorized');
  }

  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0); // Normalize to start of day

  const newMealPlan = new MealPlan({
    user: userId,
    recipe: recipeId,
    date: date
  });

  await newMealPlan.save();
  return await newMealPlan.populate('recipe');
};

exports.deleteMealPlan = async (id, userId) => {
  const mealPlan = await MealPlan.findOneAndDelete({ _id: id, user: userId });
  if (!mealPlan) {
    throw new ApiError(404, 'Meal plan not found or unauthorized');
  }
  return mealPlan;
};
