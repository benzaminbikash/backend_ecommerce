const { testimonialModel } = require("../models/testimonial.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const addTestimonial = asyncHandler(async (req, res) => {
  const { name, description, profession, rating } = req.body;
  if (!name || !description || !profession || !rating)
    throw new ApiError("All fields are required.");
  const file = req.file?.filename;
  if (!file) throw new ApiError("Image is required.", 400);
  const testimonail = await testimonialModel.create({
    name,
    description,
    profession,
    rating,
    image: file,
  });
  res
    .status(201)
    .json(new ApiResponse("Testimonial added successfully.", testimonail));
});

const getTestimonials = asyncHandler(async (req, res) => {
  const testimonial = await testimonialModel.find();
  res.status(200).json(new ApiResponse("All testimonials", testimonial));
});
const getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialModel.findById(req.params.id);
  res.status(200).json(new ApiResponse("Testimonial", testimonial));
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialModel.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(new ApiResponse("Testimonial deleted successfully.", testimonial));
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const file = req.file?.filename;
  if (file) {
    const testimonial = await testimonialModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: file,
      },
      { new: true }
    );
    res
      .status(200)
      .json(new ApiResponse("Testimonial updated successfully.", testimonial));
  } else {
    const testimonail = await testimonialModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json(new ApiResponse("Testimonial updated successfully.", testimonail));
  }
});

module.exports = {
  addTestimonial,
  getTestimonials,
  getTestimonial,
  deleteTestimonial,
  updateTestimonial,
};
