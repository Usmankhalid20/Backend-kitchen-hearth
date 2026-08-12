const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Role = require('../models/Role');

class AdminService {
    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const adminRoles = await Role.find({ name: { $in: ['Super Admin', 'Admin'] } }).select('_id');
        const adminRoleIds = adminRoles.map(r => r._id);

        const [totalUsers, totalRecipes, totalAdmins, activeUsers] = await Promise.all([
            User.countDocuments(),
            Recipe.countDocuments(),
            User.countDocuments({ role: { $in: adminRoleIds } }),
            User.countDocuments({
                $or: [
                    { lastAiGenerationDate: { $gte: today } },
                    { created_at: { $gte: today } }
                ]
            })
        ]);

        return {
            totalUsers,
            totalRecipes,
            totalAdmins,
            activeUsers,
        };
    }
}

module.exports = new AdminService();

