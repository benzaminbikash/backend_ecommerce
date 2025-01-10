const { contactModel } = require("../models/contact.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const contactAdd = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    throw new ApiError("All fields are required.");
  const contact = await contactModel.create({ name, email, message });
  res.status(200).json(new ApiResponse("Message send successfully.", contact));
});

module.exports = { contactAdd };
