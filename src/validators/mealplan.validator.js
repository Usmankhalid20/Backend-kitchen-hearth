const { z } = require('zod');

exports.createMealPlanSchema = z.object({
  recipeId: z.string().min(1, 'Recipe ID is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

