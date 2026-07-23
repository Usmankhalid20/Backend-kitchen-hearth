const Permission = require('../models/Permission');

class PermissionService {
    async createPermission(name, description) {
        const permission = new Permission({ name, description });
        return await permission.save();
    }

    async getPermissions() {
        return await Permission.find().sort({ name: 1 });
    }

    async seedDefaultPermissions() {
        const defaults = [
            { name: 'recipes.create', description: 'Create recipes' },
            { name: 'recipes.read.own', description: 'Read own recipes' },
            { name: 'recipes.update.own', description: 'Update own recipes' },
            { name: 'recipes.delete.own', description: 'Delete own recipes' },
            { name: 'recipes.read.any', description: 'Read any recipe' },
            { name: 'recipes.update.any', description: 'Update any recipe' },
            { name: 'recipes.delete.any', description: 'Delete any recipe' },
            { name: 'users.read', description: 'View users' },
            { name: 'users.update', description: 'Update users' },
            { name: 'users.suspend', description: 'Suspend users' },
            { name: 'users.changeRole', description: 'Change user roles' },
            { name: 'dashboard.read', description: 'View admin dashboard' },
            { name: 'analytics.read', description: 'View analytics' },
            { name: 'audit.read', description: 'View audit logs' },
            { name: 'admins.create', description: 'Create admins' },
            { name: 'admins.update', description: 'Update admins' },
            { name: 'admins.delete', description: 'Delete admins' },
            { name: 'permissions.manage', description: 'Manage permissions and roles' },
            { name: 'settings.manage', description: 'Manage system settings' },
        ];

        for (const p of defaults) {
            await Permission.findOneAndUpdate(
                { name: p.name },
                { description: p.description },
                { upsert: true, new: true }
            );
        }
    }
}

module.exports = new PermissionService();
