const AuditLog = require('../models/AuditLog');

class AuditService {
    async log(action, actorId, targetId = null, targetModel = null, previousValue = null, newValue = null) {
        try {
            await AuditLog.create({
                action,
                actor: actorId,
                target: targetId,
                targetModel,
                previousValue,
                newValue
            });
        } catch (error) {
            console.error('Failed to write audit log:', error);
            // We usually don't want to throw and break the main request just because logging failed
        }
    }

    async getLogs(page = 1, limit = 20, filters = {}) {
        const skip = (page - 1) * limit;
        const query = {};
        
        if (filters.action) query.action = filters.action;
        if (filters.actorId) query.actor = filters.actorId;

        const logs = await AuditLog.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('actor', 'firstName lastName username email')
            .lean();

        const total = await AuditLog.countDocuments(query);

        return {
            logs,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        };
    }
}

module.exports = new AuditService();
