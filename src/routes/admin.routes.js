const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const validators = require('../validators/admin.validator');


// All admin routes require authentication
router.use(authMiddleware);

// Dashboard
router.get('/dashboard', authorize('dashboard.read'), adminController.getDashboardStats);

// Users
router.get('/users', authorize('users.read'), adminController.getUsers);
router.get('/users/:id', authorize('users.read'), adminController.getUserDetails);
router.patch('/users/:id/status', authorize('users.suspend'), validate(validators.updateUserStatusSchema), adminController.updateUserStatus);
router.patch('/users/:id/role', authorize('users.changeRole'), validate(validators.assignRoleSchema), adminController.assignRole);

// Admins
router.post('/admins', authorize('admins.create'), validate(validators.createAdminSchema), adminController.createAdmin);

// Roles & Permissions
router.get('/roles', authorize('permissions.manage'), adminController.getRoles);
router.get('/permissions', authorize('permissions.manage'), adminController.getPermissions);
router.patch('/roles/:id/permissions', authorize('permissions.manage'), validate(validators.updateRolePermissionsSchema), adminController.updateRolePermissions);

// Analytics
router.get('/analytics', authorize('analytics.read'), adminController.getAnalytics);

// Audit Logs
router.get('/audit-logs', authorize('audit.read'), adminController.getAuditLogs);

// Settings
router.get('/settings', authorize('settings.manage'), adminController.getSettings);
router.put('/settings/:key', authorize('settings.manage'), validate(validators.updateSettingSchema), adminController.updateSetting);

// Recipes
router.get('/recipes', authorize('recipes.read.any'), adminController.getRecipes);
router.delete('/recipes/:id', authorize('recipes.delete.any'), adminController.deleteRecipe);

module.exports = router;
