const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    // Return a 400 Bad Request with the validation errors formatted nicely
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.errors
    });
  }
};

module.exports = validate;
