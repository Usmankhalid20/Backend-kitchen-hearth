const User = require('../models/User');
const ApiError = require('../utils/ApiError');

exports.getMe = async (userId) => {
  const user = await User.findById(userId).select('-password_hash').populate({
    path: 'role',
    populate: { path: 'permissions' }
  });
  if (!user) throw new ApiError(404, 'User not found');
  
  // Reset daily limit if it's a new day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (user.lastAiGenerationDate && user.lastAiGenerationDate < today) {
      user.aiGenerationCount = 0;
      user.lastAiGenerationDate = null;
      await user.save();
  }

  return user;
};

exports.checkAndIncrementAiLimit = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Reset if new day
  if (user.lastAiGenerationDate && user.lastAiGenerationDate < today) {
      user.aiGenerationCount = 0;
  }

  if (user.aiGenerationCount >= 3) {
      throw new ApiError(429, 'You have reached your daily limit of 3 recipe generations. Please try again tomorrow.');
  }

  user.aiGenerationCount += 1;
  user.lastAiGenerationDate = new Date();
  await user.save();

  return true;
};

exports.updateMe = async (userId, updateData) => {
  // Only allow updating specific fields
  const allowedUpdates = {};
  if (updateData.firstName) allowedUpdates.firstName = updateData.firstName;
  if (updateData.lastName) allowedUpdates.lastName = updateData.lastName;
  if (updateData.avatar) allowedUpdates.avatar = updateData.avatar;

  const user = await User.findByIdAndUpdate(userId, allowedUpdates, { new: true })
      .select('-password_hash')
      .populate({
        path: 'role',
        populate: { path: 'permissions' }
      });
  
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};
