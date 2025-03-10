const { blogModal } = require("../models/blog.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const addBlog = async (req, res) => {
  const file = req.file?.filename;
  if (!file) throw new ApiError("Image is required.", 400);
  const blog = await blogModal.create({
    ...req.body,
    image: file,
  });
  res.status(201).json(new ApiResponse("Blog added successfully.", blog));
};

const getBlog = async (req, res) => {
  const blog = await blogModal.find();
  res.status(200).json(new ApiResponse("All Blog.", blog));
};

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await blogModal.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse("Blog deleted successfully.", blog));
});

const updateBlog = asyncHandler(async (req, res) => {
  const file = req.file?.filename;
  if (file) {
    const blog = await blogModal.findByIdAndUpdate(req.params.id, {
      ...req.body,
      image: file,
    });
    res.status(200).json(new ApiResponse("Blog updated successfully.", blog));
  } else {
    const blog = await blogModal.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    res.status(200).json(new ApiResponse("Blog updated successfully.", blog));
  }
});

module.exports = { addBlog, deleteBlog, getBlog, updateBlog };
