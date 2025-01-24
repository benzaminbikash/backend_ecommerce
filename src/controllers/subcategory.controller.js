const { subCategoryModel } = require("../models/subcategory.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateMongodbId } = require("../utils/validateMongodb");
const { ApiResponse } = require("../utils/ApiResponse");

const addSubCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;
  validateMongodbId(category);
  const subcategory = await subCategoryModel.create(req.body);
  res
    .status(201)
    .json(new ApiResponse("Sub Category Added successfully.", subcategory));
});

const getSubCategory = asyncHandler(async (req, res) => {
  if (req.query.category) {
    validateMongodbId(req.query.category);
    const subcategory = await subCategoryModel.find({
      category: req.query.category,
    });
    res
      .status(200)
      .json(
        new ApiResponse("Sub Category Data of Main Category.", subcategory)
      );
  } else {
    const subcategory = await subCategoryModel.find().populate("category");
    res.status(200).json(new ApiResponse("All Sub Categories.", subcategory));
  }
});

const deleteSubCategory = asyncHandler(async (req, res) => {
  const subcategory = await subCategoryModel.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(new ApiResponse("Sub Category Deleted Successfully.", subcategory));
});

const updateSubCategory = asyncHandler(async (req, res) => {
  const subcategory = await subCategoryModel.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  res
    .status(200)
    .json(new ApiResponse("Sub Category Updated successfully.", subcategory));
});

module.exports = {
  getSubCategory,
  deleteSubCategory,
  addSubCategory,
  updateSubCategory,
};
