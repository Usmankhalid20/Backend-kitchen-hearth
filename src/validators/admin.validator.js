const { z } = require('zod');

const assignRoleSchema = z.object({
    roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Role ID format")
});

const updateUserStatusSchema = z.object({
    status: z.enum(['Active', 'Suspended', 'Deleted'])
});

const createAdminSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Role ID format").optional(), // Optional, default to Admin
});

const updateRolePermissionsSchema = z.object({
    permissions: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Permission ID format"))
});

const updateSettingSchema = z.object({
    value: z.any()
});

module.exports = {
    assignRoleSchema,
    updateUserStatusSchema,
    createAdminSchema,
    updateRolePermissionsSchema,
    updateSettingSchema,
};
