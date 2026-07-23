const checkOwnership = (resourceModel, resourceIdParam, anyPermission) => {
    return async (req, res, next) => {
        try {
            // Ensure authorize middleware ran before this
            if (!req.userModel) {
                return res.status(500).json({ success: false, message: 'Server Error: User not loaded' });
            }

            const resourceId = req.params[resourceIdParam];
            if (!resourceId) {
                return res.status(400).json({ success: false, message: 'Resource ID missing' });
            }

            const resource = await resourceModel.findById(resourceId);
            
            if (!resource) {
                return res.status(404).json({ success: false, message: 'Resource not found' });
            }

            // If user owns the resource
            if (resource.user && resource.user.toString() === req.userModel._id.toString()) {
                req.resource = resource; // Pass it along to save DB calls later
                return next();
            }

            // If not owner, check if user has the overriding '.any' permission
            const hasAnyPermission = req.userModel.role && req.userModel.role.permissions.some(p => p.name === anyPermission);

            if (hasAnyPermission) {
                req.resource = resource;
                return next();
            }

            return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access this resource' });

        } catch (error) {
            console.error('Ownership Error:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };
};

module.exports = checkOwnership;
