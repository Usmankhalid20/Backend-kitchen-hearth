const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
        },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        target: {
            type: mongoose.Schema.Types.ObjectId,
            // Could be User, Recipe, Role, etc. We can keep it generic or add a targetModel field if needed.
        },
        targetModel: {
            type: String,
        },
        previousValue: {
            type: mongoose.Schema.Types.Mixed,
        },
        newValue: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// TTL Index to automatically delete documents 90 days after creation
// 90 days = 90 * 24 * 60 * 60 = 7776000 seconds
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
