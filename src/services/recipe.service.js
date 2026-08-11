const Recipe = require('../models/Recipe');
const ApiError = require('../utils/ApiError');

exports.saveRecipe = async (recipeData, userId) => {
  const newRecipe = new Recipe({
    ...recipeData,
    user: userId
  });
  
  await newRecipe.save();
  return newRecipe;
};

exports.getAllRecipes = async (page = 1, limit = 20, search = '') => {
  const skip = (page - 1) * limit;
  const query = {};
  
  if (search) {
      query.title = { $regex: search, $options: 'i' };
  }

  const recipes = await Recipe.find(query)
      .populate('user', 'firstName lastName email username')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

  const total = await Recipe.countDocuments(query);

  return {
      recipes,
      pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
      }
  };
};

exports.deleteRecipeById = async (id) => {
  return await Recipe.findByIdAndDelete(id);
};

// --- User Specific Methods ---

exports.getUserRecipes = async (userId) => {
  return await Recipe.find({ user: userId }).sort({ created_at: -1 });
};

exports.getRecipeById = async (id, userId) => {
  const recipe = await Recipe.findOne({ _id: id, user: userId });
  if (!recipe) {
    throw new ApiError(404, 'Recipe not found or unauthorized');
  }
  return recipe;
};

exports.deleteUserRecipe = async (id, userId) => {
  const recipe = await Recipe.findOneAndDelete({ _id: id, user: userId });
  if (!recipe) {
    throw new ApiError(404, 'Recipe not found or unauthorized');
  }
  return recipe;
};

exports.toggleFavorite = async (id, userId) => {
  const recipe = await Recipe.findOne({ _id: id, user: userId });
  if (!recipe) {
    throw new ApiError(404, 'Recipe not found or unauthorized');
  }
  recipe.isFavorite = !recipe.isFavorite;
  await recipe.save();
  return recipe;
};

