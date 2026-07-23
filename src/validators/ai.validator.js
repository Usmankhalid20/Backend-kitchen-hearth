const { z } = require('zod');

exports.generateRecipeSchema = z.object({
  prompt: z.string()
    .min(3, "Prompt must be at least 3 characters long")
    .max(500, "Prompt must be less than 500 characters"),
});
