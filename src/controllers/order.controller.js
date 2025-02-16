const orderModel = require("../models/order.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const postOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.create(req.body);
  res.status(201).json(new ApiResponse("Order is successfully done.", order));
});

const allOrder = asyncHandler(async (req, res) => {
  const order = await orderModel
    .find()
    .populate("address")
    .populate({
      path: "products.product",
      model: "Product",
    })
    .populate({
      path: "products.attributes.title",
      model: "Attribute",
    });
  res.status(200).json(new ApiResponse("All order.", order));
});

const userOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const order = await orderModel.findOne({ user: _id });
  res.status(200).json(new ApiResponse("My Order.", order));
});

const updateOrder = asyncHandler(async (req, res) => {
  const data = await orderModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(202)
    .json(new ApiResponse("Update Order Status and Order Number.", data));
});

const cancelOrder = asyncHandler(async (req, res) => {});

module.exports = { postOrder, allOrder, userOrder, updateOrder };
