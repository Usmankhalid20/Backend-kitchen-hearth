const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

exports.register = asyncHandler(async (req, res) => {
  // req.body is already validated by the validate middleware in routes
  const result = await authService.registerUser(req.body);
  setAuthCookie(res, result.token);
  
  res.status(201).json({
    success: true,
    ...result
  });
});

exports.login = asyncHandler(async (req, res) => {
  // req.body is already validated by the validate middleware in routes
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  setAuthCookie(res, result.token);
  
  res.status(200).json({
    success: true,
    ...result
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  res.json({
    success: true,
    user
  });
});

exports.updateMe = asyncHandler(async (req, res) => {
  const updateData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };

  if (req.file && req.file.path) {
    updateData.avatar = req.file.path; // Cloudinary URL
  }

  const updatedUser = await userService.updateMe(req.user.id, updateData);
  
  res.json({
    success: true,
    user: updatedUser
  });
});

