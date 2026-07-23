const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password_hash: {
            type: String,
            required: true,
        },
        aiGenerationCount: {
            type: Number,
            default: 0,
        },
        lastAiGenerationDate: {
            type: Date,
            default: null,
        },
        avatar: {
            type: String,
            default: null,
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
        },
        status: {
            type: String,
            enum: ['Active', 'Suspended', 'Deleted'],
            default: 'Active',
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        } // Automatically manages created_at and updated_at
    }
);

module.exports = mongoose.model('User', userSchema);
