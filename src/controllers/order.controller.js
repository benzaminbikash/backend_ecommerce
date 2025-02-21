const orderModel = require("../models/order.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const postOrder = asyncHandler(async (req, res) => {
  try {
    const customvalue = Math.floor(Math.random() * 10000);
    const deliveryid = customvalue.toString().padEnd(5, "0");
    let products = req.body.products;
    if (typeof products === "string") {
      products = JSON.parse(products);
    }
    const orderData = {
      ...req.body,
      products,
      deliveryid,
    };
    if (req.body.payment_method !== "cashondelivery") {
      if (!req.file || !req.file.filename) {
        return res
          .status(400)
          .json({ message: "Payment proof image is required" });
      }
      orderData.onlinepayimage = req.file.filename;
    }
    const order = await orderModel.create(orderData);
    res.status(201).json(new ApiResponse("Order is successfully done.", order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

module.exports = { postOrder, allOrder, userOrder, updateOrder };
