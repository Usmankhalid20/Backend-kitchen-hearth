require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const permissionService = require('../services/permission.service');

const seedSuperAdmin = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Seeding default permissions...');
        await permissionService.seedDefaultPermissions();

        console.log('Creating roles...');
        const allPermissions = await Permission.find();
        const permissionIds = allPermissions.map(p => p._id);

        const roles = [
            { name: 'Super Admin', permissions: permissionIds }, // Gets all permissions
            { name: 'Admin', permissions: allPermissions.filter(p => p.name !== 'permissions.manage' && p.name !== 'settings.manage' && p.name !== 'admins.create').map(p => p._id) },
            { name: 'Moderator', permissions: allPermissions.filter(p => p.name.includes('recipes') || p.name === 'users.read').map(p => p._id) },
            { name: 'User', permissions: allPermissions.filter(p => p.name.includes('.own')).map(p => p._id) },
        ];

        for (const roleData of roles) {
            await Role.findOneAndUpdate(
                { name: roleData.name },
                { permissions: roleData.permissions },
                { upsert: true, returnDocument: 'after' }
            );
        }

        console.log('Creating Super Admin account...');
        const superAdminRole = await Role.findOne({ name: 'Super Admin' });

        const existingAdmin = await User.findOne({ email: 'admin@kitchenhearth.com' });
        if (existingAdmin) {
            console.log('Super Admin already exists. Updating role...');
            existingAdmin.role = superAdminRole._id;
            await existingAdmin.save();
        } else {
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash('SuperAdmin123!', salt);

            await User.create({
                firstName: 'System',
                lastName: 'Administrator',
                username: 'superadmin',
                email: 'admin@kitchenhearth.com',
                password_hash,
                role: superAdminRole._id,
                status: 'Active'
            });
            console.log('Super Admin created (admin@kitchenhearth.com / SuperAdmin123!)');
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedSuperAdmin();
