const addressModel = require("../models/address.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const addAddress = asyncHandler(async (req, res) => {
  const address = await addressModel.create(req.body);
  res
    .status(200)
    .json(new ApiResponse("Address created successfully.", address));
});

const getAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const address = await addressModel.find({ user: _id });
  res.status(200).json(new ApiResponse("Your Address", address));
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await addressModel.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json(new ApiResponse("Your Address updated.", address));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const address = await addressModel.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse("Your Address updated.", address));
});

module.exports = { addAddress, getAddress, updateAddress, deleteAddress };
