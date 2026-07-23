const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // If the error isn't an instance of our ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof Error ? 500 : 400;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};

module.exports = errorMiddleware;
