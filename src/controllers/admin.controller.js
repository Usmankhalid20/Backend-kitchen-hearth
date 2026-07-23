const adminService = require('../services/admin.service');
const userAdminService = require('../services/user-admin.service');
const roleService = require('../services/role.service');
const permissionService = require('../services/permission.service');
const analyticsService = require('../services/analytics.service');
const settingService = require('../services/setting.service');
const auditService = require('../services/audit.service');
const recipeService = require('../services/recipe.service');

// Wrapper for async errors
const asyncHandler = require('../utils/asyncHandler');

// Dashboard
exports.getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
});

// Users
exports.getUsers = asyncHandler(async (req, res) => {
    const { page, limit, search, status, roleId } = req.query;
    const result = await userAdminService.getUsers(
        parseInt(page) || 1, 
        parseInt(limit) || 20, 
        { search, status, roleId }
    );
    res.json({ success: true, data: result });
});

exports.getUserDetails = asyncHandler(async (req, res) => {
    const user = await userAdminService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
});

exports.updateUserStatus = asyncHandler(async (req, res) => {
    const user = await userAdminService.updateUserStatus(req.params.id, req.body.status);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    await auditService.log('USER_STATUS_UPDATE', req.user.id || req.user._id, user._id, 'User', null, req.body.status);
    
    res.json({ success: true, data: user });
});

// Admins
exports.createAdmin = asyncHandler(async (req, res) => {
    const admin = await userAdminService.createAdmin(req.body);
    await auditService.log('ADMIN_CREATED', req.user.id || req.user._id, admin._id, 'User');
    res.status(201).json({ success: true, data: admin });
});

exports.assignRole = asyncHandler(async (req, res) => {
    const user = await userAdminService.assignRole(req.params.id, req.body.roleId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    await auditService.log('ROLE_ASSIGNED', req.user.id || req.user._id, user._id, 'User', null, req.body.roleId);
    
    res.json({ success: true, data: user });
});

// Roles & Permissions
exports.getRoles = asyncHandler(async (req, res) => {
    const roles = await roleService.getRoles();
    res.json({ success: true, data: roles });
});

exports.getPermissions = asyncHandler(async (req, res) => {
    const permissions = await permissionService.getPermissions();
    res.json({ success: true, data: permissions });
});

exports.updateRolePermissions = asyncHandler(async (req, res) => {
    const role = await roleService.updateRolePermissions(req.params.id, req.body.permissions);
    
    await auditService.log('ROLE_PERMISSIONS_UPDATED', req.user.id || req.user._id, role._id, 'Role');
    
    res.json({ success: true, data: role });
});

// Analytics
exports.getAnalytics = asyncHandler(async (req, res) => {
    const stats = await analyticsService.getAIUsageAnalytics();
    res.json({ success: true, data: stats });
});

// Audit Logs
exports.getAuditLogs = asyncHandler(async (req, res) => {
    const { page, limit, action, actorId } = req.query;
    const result = await auditService.getLogs(
        parseInt(page) || 1, 
        parseInt(limit) || 20, 
        { action, actorId }
    );
    res.json({ success: true, data: result });
});

// Settings
exports.getSettings = asyncHandler(async (req, res) => {
    const settings = await settingService.getSettings();
    res.json({ success: true, data: settings });
});

exports.updateSetting = asyncHandler(async (req, res) => {
    const setting = await settingService.updateSetting(req.params.key, req.body.value);
    await auditService.log('SETTING_UPDATED', req.user.id || req.user._id, setting._id, 'Setting', null, req.body.value);
    res.json({ success: true, data: setting });
});

// Recipes
exports.getRecipes = asyncHandler(async (req, res) => {
    const { page, limit, search } = req.query;
    const result = await recipeService.getAllRecipes(
        parseInt(page) || 1,
        parseInt(limit) || 20,
        search
    );
    res.json({ success: true, data: result });
});

exports.deleteRecipe = asyncHandler(async (req, res) => {
    const recipe = await recipeService.deleteRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    
    await auditService.log('RECIPE_DELETED', req.user.id || req.user._id, recipe._id, 'Recipe');
    
    res.json({ success: true, message: 'Recipe deleted successfully' });
});
