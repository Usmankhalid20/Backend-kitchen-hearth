const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        prepTime: {
            type: String,
        },
        cookTime: {
            type: String,
        },
        servings: {
            type: Number,
            default: 1,
        },
        ingredients: [
            {
                type: String,
            }
        ],
        instructions: [
            {
                type: String,
            }
        ],
        visibility: {
            type: String,
            enum: ['Private', 'Public', 'Reported'],
            default: 'Private',
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

module.exports = mongoose.model('Recipe', recipeSchema);
