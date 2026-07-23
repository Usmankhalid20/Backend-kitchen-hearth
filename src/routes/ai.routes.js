const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { generateRecipeSchema } = require('../validators/ai.validator');
const { aiGenerationLimiter } = require('../middlewares/rateLimiter.middleware');

// POST /api/v1/ai/generate
router.post('/generate', authMiddleware, aiGenerationLimiter, validate(generateRecipeSchema), aiController.generateRecipe);

module.exports = router;
