const { categoryModel } = require("../models/category.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const addCategory = asyncHandler(async (req, res) => {
  const { title, order } = req.body;
  if (!title) throw new ApiError("Title is required.", 400);
  const existcategory = await categoryModel.findOne({ title });
  if (existcategory)
    throw new ApiError("This name of category is exist. Please write new one.");
  if (!order) throw new ApiError("Order is required.", 400);
  const checkordernumber = await categoryModel.findOne({ order: order });
  if (checkordernumber) throw new ApiError("");
  const file = req.file?.filename;
  if (!file) throw new ApiError("Image is required.", 400);
  const category = await categoryModel.create({
    title,
    image: file,
    order,
  });
  res
    .status(201)
    .json(new ApiResponse("Category added successfully.", category));
});

const getCategories = asyncHandler(async (req, res) => {
  const category = await categoryModel.find().sort("order");
  res.status(200).json(new ApiResponse("All categories", category));
});

const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryModel.findById(req.params.id);
  res.status(200).json(new ApiResponse("Single Category", category));
});

const updateCategory = asyncHandler(async (req, res) => {
  const file = req.file?.filename;
  if (file) {
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: file,
      },
      {
        new: true,
      }
    );
    res
      .status(200)
      .json(new ApiResponse("Category updated successfully.", category));
  } else {
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res
      .status(200)
      .json(new ApiResponse("Category updated successfully.", category));
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await categoryModel.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(new ApiResponse("Category deleted successfully.", category));
});

module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategory,
};
