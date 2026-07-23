const Setting = require('../models/Setting');

class SettingService {
    async getSettings() {
        const settings = await Setting.find();
        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
    }

    async updateSetting(key, value) {
        return await Setting.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );
    }
}

module.exports = new SettingService();
