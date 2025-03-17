const { contactModel } = require("../models/contact.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { emailConfig } = require("../utils/emailConfig");
const { EmailMessage } = require("../utils/Message");

const contactMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    throw new ApiError("All fields are required.");
  const contact = await contactModel.create({ name, email, message });
  await emailConfig(
    email,
    "Contact Us Message",
    EmailMessage(name, email, message)
  );
  res.status(201).json(new ApiResponse("Message send successfully.", contact));
});

const getAllContact = asyncHandler(async (req, res) => {
  const contact = await contactModel.find();
  res.status(200).json(new ApiResponse("All contact.", contact));
});

module.exports = { contactMessage, getAllContact };
