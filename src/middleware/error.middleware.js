const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(400);
  next(error);
};

const errorMiddleware = (error, req, res, next) => {
  const statuscode = error.statusCode || 500;
  res.status(statuscode).json({
    message: error.message,
    stack: error.stack,
  });
};

module.exports = { notFound, errorMiddleware };
