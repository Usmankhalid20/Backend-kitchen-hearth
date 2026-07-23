const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            // e.g., "ai_daily_limit", "app_maintenance_mode"
        },
        value: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        description: {
            type: String,
        },
        type: {
            type: String,
            enum: ['string', 'number', 'boolean', 'json'],
            default: 'string',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Setting', settingSchema);
