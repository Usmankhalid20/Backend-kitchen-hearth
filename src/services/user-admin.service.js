const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');

class UserAdminService {
    async getUsers(page = 1, limit = 20, filters = {}) {
        const skip = (page - 1) * limit;
        const query = {};

        if (filters.search) {
            query.$or = [
                { email: { $regex: filters.search, $options: 'i' } },
                { username: { $regex: filters.search, $options: 'i' } },
                { firstName: { $regex: filters.search, $options: 'i' } },
                { lastName: { $regex: filters.search, $options: 'i' } }
            ];
        }
        if (filters.status) query.status = filters.status;
        if (filters.roleId) query.role = filters.roleId;

        const users = await User.find(query)
            .select('-password_hash')
            .populate('role')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        return {
            users,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async getUserById(id) {
        return await User.findById(id).select('-password_hash').populate('role');
    }

    async updateUserStatus(id, status) {
        return await User.findByIdAndUpdate(id, { status }, { new: true }).select('-password_hash');
    }

    async assignRole(userId, roleId) {
        return await User.findByIdAndUpdate(userId, { role: roleId }, { new: true }).select('-password_hash');
    }

    async createAdmin(data) {
        const { firstName, lastName, username, email, password, roleId } = data;
        
        let targetRoleId = roleId;
        if (!targetRoleId) {
            const adminRole = await Role.findOne({ name: 'Admin' });
            if (adminRole) targetRoleId = adminRole._id;
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newAdmin = new User({
            firstName,
            lastName,
            username,
            email,
            password_hash,
            role: targetRoleId,
            status: 'Active'
        });

        await newAdmin.save();
        return await User.findById(newAdmin._id).select('-password_hash').populate('role');
    }
}

module.exports = new UserAdminService();
