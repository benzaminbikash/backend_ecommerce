const attributeModel = require("../models/attribute.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const addAttribute = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const attribute = await attributeModel.create({ title });
  res
    .status(201)
    .json(new ApiResponse("Attribute Added Successfully", attribute));
});

const getAllAttribute = asyncHandler(async (req, res) => {
  const attribute = await attributeModel.find();
  res.status(200).json(new ApiResponse("All Attributes ", attribute));
});

const updateAttribute = asyncHandler(async (req, res) => {
  const attribute = await attributeModel.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  res
    .status(200)
    .json(new ApiResponse("Attribute updated successfully.", attribute));
});

const deleteAttribute = asyncHandler(async (req, res) => {
  const attribute = await attributeModel.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(new ApiResponse("Attribute deleted successfully.", attribute));
});

module.exports = {
  addAttribute,
  getAllAttribute,
  updateAttribute,
  deleteAttribute,
};
