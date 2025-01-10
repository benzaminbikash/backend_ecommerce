const statisticModel = require("../models/statistic.model");
const { asyncHandler } = require("../utils/asyncHandler");

const addStatistic = asyncHandler(async (req, res) => {
  const { title, value } = req.body;
  const file = req.file.filename;
  const statistic = await statisticModel.create({
    title,
    value,
    image: file,
  });
  res
    .status(201)
    .json(new ApiResponse("Statistic added successfully.", statistic));
});

const getStatistic = asyncHandler(async (req, res) => {
  const statistic = await statisticModel.find();
  res.status(201).json(new ApiResponse("All Statistics.", statistic));
});

const deleteStatistic = asyncHandler(async (req, res) => {
  const statistic = await statisticModel.find(req.params.id);
  res
    .status(201)
    .json(new ApiResponse("Statistic updated successfully.", statistic));
});

const updateStatistic = asyncHandler(async (req, res) => {
  const file = req.file?.filename;
  if (file) {
    const statistic = await statisticModel.findByIdAndUpdate(req.params.id, {
      ...req.body,
      image: file,
    });
    res
      .status(200)
      .json(new ApiResponse("Statistic updated successfully.", statistic));
  } else {
    const statistic = await statisticModel.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    res
      .status(200)
      .json(new ApiResponse("Statistic updated successfully.", statistic));
  }
});

module.exports = {
  addStatistic,
  getStatistic,
  deleteStatistic,
  updateStatistic,
};
