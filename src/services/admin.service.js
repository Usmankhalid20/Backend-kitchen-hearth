const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Role = require('../models/Role');

class AdminService {
    async getDashboardStats() {
        const totalUsers = await User.countDocuments();
        const totalRecipes = await Recipe.countDocuments();
        
        const adminRoles = await Role.find({ name: { $in: ['Super Admin', 'Admin'] } }).select('_id');
        const adminRoleIds = adminRoles.map(r => r._id);
        
        const totalAdmins = await User.countDocuments({ role: { $in: adminRoleIds } });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Active users (users created recently or generated AI recipes today)
        const activeUsers = await User.countDocuments({
            $or: [
                { lastAiGenerationDate: { $gte: today } },
                { created_at: { $gte: today } }
            ]
        });

        return {
            totalUsers,
            totalRecipes,
            totalAdmins,
            activeUsers,
        };
    }
}

module.exports = new AdminService();
