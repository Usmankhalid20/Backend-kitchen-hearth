const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

exports.registerUser = async (data) => {
  const { firstName, lastName, username, email, password } = data;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) throw new ApiError(400, 'Email already exists');

  const existingUsername = await User.findOne({ username });
  if (existingUsername) throw new ApiError(400, 'Username already taken');

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const user = new User({ firstName, lastName, username, email, password_hash });
  await user.save();

  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

  const populatedUser = await User.findById(user._id).select('-password_hash').populate({
    path: 'role',
    populate: { path: 'permissions' }
  });

  return { token, user: populatedUser };
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

  const populatedUser = await User.findById(user._id).select('-password_hash').populate({
    path: 'role',
    populate: { path: 'permissions' }
  });

  return { token, user: populatedUser };
};
