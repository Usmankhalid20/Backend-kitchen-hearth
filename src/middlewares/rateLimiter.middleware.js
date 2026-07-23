const rateLimit = require('express-rate-limit');
const ApiError = require('../utils/ApiError');

// Rate limit for AI generation: 3 requests per day per User/IP
exports.aiGenerationLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 3, // Limit each IP/User to 3 requests per windowMs
    handler: (req, res, next) => {
        next(new ApiError(429, 'You have reached your daily limit of 3 recipe generations. Please try again tomorrow.'));
    },
    // If the user is authenticated, use their ID as the key, otherwise use IP
    keyGenerator: (req) => {
        return req.user ? req.user.id : req.ip;
    }
});

// Rate limit for Auth routes to prevent brute-force attacks
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    handler: (req, res, next) => {
        next(new ApiError(429, 'Too many authentication attempts, please try again after 15 minutes.'));
    }
});
