const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

// Add an index to easily query by user and date
mealPlanSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
