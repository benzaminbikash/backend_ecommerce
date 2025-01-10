const subattributeModel = require("../models/subattribute.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const addSubAttribute = asyncHandler(async (req, res) => {
  const { attribute } = req.body;
  const findSubAttribute = await subattributeModel.findOne({ attribute });
  if (findSubAttribute) throw new ApiError("You can add same attribute.");
  const subattribute = await subattributeModel.create(req.body);
  res
    .status(201)
    .json(new ApiResponse("Sub Attribute Added Successfully", subattribute));
});

const getsubAttributes = asyncHandler(async (req, res) => {
  const attribute = await subattributeModel.find().populate("attribute");
  res.status(200).json(new ApiResponse("All Sub Attributes ", attribute));
});

const deletesubAttributes = asyncHandler(async (req, res) => {
  const subattribute = await subattributeModel.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse("All Sub Attributes ", subattribute));
});

const updatesubAttributes = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const subattribute = await subattributeModel.findByIdAndUpdate(
    req.params.id,
    {
      title: title,
    }
  );
  res.status(200).json(new ApiResponse("All Sub Attributes ", subattribute));
});

module.exports = {
  addSubAttribute,
  getsubAttributes,
  deletesubAttributes,
  updatesubAttributes,
};
