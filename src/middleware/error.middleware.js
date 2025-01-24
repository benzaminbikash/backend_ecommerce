const { ApiError } = require("../utils/ApiError");

const notFound = (req, res, next) => {
  const error = new ApiError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      message: `The ${field} must be unique`,
      stack: error.stack,
    });
  }
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((val) => val.message);
    return res.status(400).json({
      message: messages[0],
      stack: error.stack,
    });
  }

  res.status(statusCode).json({
    message: error.message || "Internal Server Error",
    stack: error.stack,
  });
};

module.exports = { notFound, errorMiddleware };
