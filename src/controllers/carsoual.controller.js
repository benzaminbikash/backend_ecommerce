const carsoualModel = require("../models/carsoual.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const addCarsoual = asyncHandler(async (req, res) => {
  const { title, subtitle } = req.body;
  if (!title) throw new ApiError("Title is required.");
  if (!subtitle) throw new ApiError("Subtitle is required.");
  const data = [];
  req.files.map((item) => {
    data.push(item.filename);
  });

  console.log(data);
  if (data.length == 0) throw new ApiError("Image must be atleast one.");
  const carsoual = await carsoualModel.create({
    title: title,
    subtitle: subtitle,
    carsoualimage: data,
  });
  res
    .status(201)
    .json(new ApiResponse("Carousel added successfully.", carsoual));
});

const getCarsoual = asyncHandler(async (req, res) => {
  const carsoual = await carsoualModel.find();
  res.status(200).json(new ApiResponse("All Carousel.", carsoual));
});

const deleteCarsoual = asyncHandler(async (req, res) => {
  const carsoual = await carsoualModel.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(new ApiResponse("Carousel delete successfully.", carsoual));
});

const updateCarsoual = asyncHandler(async (req, res) => {
  const files = req.files.filename;
  const data = [];
  req.files.map((item) => {
    data.push(item.filename);
  });
  if (files) {
    await carsoualModel.findByIdAndUpdate(req.params.id, {
      ...req.body,
      carsoualimage: data,
    });
  } else {
    await carsoualModel.findByIdAndUpdate(req.params.id, req.body);
  }
  const carsoual = await carsoualModel.findById(req.params.id);
  res
    .status(200)
    .json(new ApiResponse("Carsoual updated successfully.", carsoual));
});

module.exports = {
  addCarsoual,
  getCarsoual,
  deleteCarsoual,
  updateCarsoual,
};
