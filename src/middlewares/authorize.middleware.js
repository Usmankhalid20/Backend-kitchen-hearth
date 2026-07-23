const User = require('../models/User');

const authorize = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            // req.user is set by auth.middleware.js (usually contains { id: ... })
            if (!req.user || (!req.user.id && !req.user._id)) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const userId = req.user.id || req.user._id;

            const user = await User.findById(userId).populate({
                path: 'role',
                populate: {
                    path: 'permissions',
                    model: 'Permission'
                }
            });

            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            if (user.status === 'Suspended') {
                return res.status(403).json({ success: false, message: 'Account suspended' });
            }

            if (user.status === 'Deleted') {
                return res.status(403).json({ success: false, message: 'Account deleted' });
            }

            req.userModel = user; // Store the full populated user for later middlewares/controllers

            // If no required permission is specified, just pass through (useful for just ensuring full user is loaded)
            if (!requiredPermission) {
                return next();
            }

            // Check if user has a role and permissions
            if (!user.role || !user.role.permissions) {
                return res.status(403).json({ success: false, message: 'Forbidden: Missing permissions' });
            }

            const hasPermission = user.role.permissions.some(p => p.name === requiredPermission.toLowerCase());

            if (!hasPermission) {
                return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error('Authorization Error:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };
};

module.exports = authorize;
