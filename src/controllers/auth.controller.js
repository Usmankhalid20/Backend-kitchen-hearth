const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  // req.body is already validated by the validate middleware in routes
  const result = await authService.registerUser(req.body);
  
  res.status(201).json({
    success: true,
    ...result
  });
});

exports.login = asyncHandler(async (req, res) => {
  // req.body is already validated by the validate middleware in routes
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  
  res.status(200).json({
    success: true,
    ...result
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
