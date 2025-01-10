const bannerModel = require("../models/banner.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const addBanner = asyncHandler(async (req, res) => {
  const file = req.file?.filename;
  if (!file) throw new ApiError("Image is required.", 400);
  const banner = await bannerModel.create({
    ...req.body,
    image: file,
  });
  res.status(201).json(new ApiResponse("Banner added successfully.", banner));
});

const getBanner = asyncHandler(async (req, res) => {
  const banner = await bannerModel.find();
  res.status(200).json(new ApiResponse("All Banners.", banner));
});

const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await bannerModel.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse("Banner deleted successfully.", banner));
});

const updateBanner = asyncHandler(async (req, res) => {
  const file = req.file?.filename;
  if (file) {
    const banner = await bannerModel.findByIdAndUpdate(req.params.id, {
      ...req.body,
      image: file,
    });
    res
      .status(200)
      .json(new ApiResponse("Banner updated successfully.", banner));
  } else {
    const banner = await bannerModel.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    res
      .status(200)
      .json(new ApiResponse("Banner updated successfully.", banner));
  }
});

module.exports = { addBanner, getBanner, deleteBanner, updateBanner };
