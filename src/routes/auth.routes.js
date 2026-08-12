const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const { upload } = require('../config/cloudinary');

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);
router.put('/me', authMiddleware, upload.single('avatar'), authController.updateMe);

module.exports = router;

