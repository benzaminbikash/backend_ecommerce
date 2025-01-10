const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { authModel } = require("../models/auth.model");

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accesstoken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError("Token is not available.", 400);
    const { _id } = jwt.verify(token, process.env.Accesstoken);
    const user = await authModel.findById(_id);
    if (!user) throw new ApiError("Invalid token.");
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(error.message, 400);
  }
});

const adminMiddleware = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await authModel.findById(_id);
  if (user.role != "admin") throw new ApiError("You are not admin.", 400);
  next();
});

module.exports = { authMiddleware, adminMiddleware };
