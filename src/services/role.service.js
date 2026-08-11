const Role = require('../models/Role');

class RoleService {
    async createRole(name, permissionIds = []) {
        const role = new Role({ name, permissions: permissionIds });
        return await role.save();
    }

    async getRoles() {
        return await Role.find().populate('permissions');
    }

    async getRoleByName(name) {
        return await Role.findOne({ name }).populate('permissions');
    }

    async updateRolePermissions(roleId, permissionIds) {
        return await Role.findByIdAndUpdate(
            roleId,
            { permissions: permissionIds },
            { returnDocument: 'after' }
        ).populate('permissions');
    }
}

module.exports = new RoleService();
