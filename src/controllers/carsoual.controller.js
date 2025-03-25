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
  const oldData = await carsoualModel.findById(req.params.id);

  if (!oldData) throw new ApiError("Carousel not found.");

  let updatedImages = [...oldData.carsoualimage];

  if (req.body.imagesToRemove) {
    const imagesToRemove = JSON.parse(req.body.imagesToRemove);
    updatedImages = updatedImages.filter(
      (image) => !imagesToRemove.includes(image)
    );
  }

  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      const indexMatch = Object.keys(req.body).find((key) =>
        key.startsWith("image_")
      );

      if (indexMatch) {
        const index = parseInt(indexMatch.split("_")[1]);
        updatedImages[index] = file.filename;
      } else {
        updatedImages.push(file.filename);
      }
    });
  }

  const updatedCarousel = await carsoualModel.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      carsoualimage: updatedImages,
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse("Carousel updated successfully.", updatedCarousel));
});

module.exports = {
  addCarsoual,
  getCarsoual,
  deleteCarsoual,
  updateCarsoual,
};
