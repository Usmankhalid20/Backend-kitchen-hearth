const User = require('../models/User');

class AnalyticsService {
    async getAIUsageAnalytics() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeUsers = await User.find({
            lastAiGenerationDate: { $gte: today }
        }).select('firstName lastName email aiGenerationCount lastAiGenerationDate').lean();

        const totalRequestsToday = activeUsers.reduce((sum, user) => sum + (user.aiGenerationCount || 0), 0);

        return {
            requestsToday: totalRequestsToday,
            activeUsersToday: activeUsers.length,
            topUsers: activeUsers.sort((a, b) => b.aiGenerationCount - a.aiGenerationCount).slice(0, 10)
        };
    }
}

module.exports = new AnalyticsService();
