const { authModel } = require("../models/auth.model");
const orderModel = require("../models/order.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { emailConfig } = require("../utils/emailConfig");
const { OrderSend, OrderStatusChange } = require("../utils/Message");

const postOrder = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await authModel.findById(_id);
    let products = req.body.products;
    if (typeof products === "string") {
      products = JSON.parse(products);
    }

    let checkproduct = [];
    Array.isArray(products)
      ? products.map((item) => checkproduct.push(item?.product.title))
      : checkproduct.push(products?.product.title);

    const orderData = {
      ...req.body,
      products,
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
    await emailConfig(
      user?.email,
      "Order is Pending.",
      OrderSend(user?.fullname, checkproduct)
    );
    res.status(201).json(new ApiResponse("Order is successfully done.", order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const allOrder = asyncHandler(async (req, res) => {
  const order = await orderModel
    .find()
    .populate("user shippingAddress billingAddress", "-password")
    .populate({
      path: "products.product",
      model: "Product",
    })
    .populate({
      path: "products.attributes",
      populate: { path: "title", model: "Attribute" },
    });
  res.status(200).json(new ApiResponse("All order.", order));
});

const userOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const order = await orderModel
    .find({ user: _id })
    .populate("user shippingAddress billingAddress", "-password")
    .populate({
      path: "products.product",
      model: "Product",
    })
    .populate({
      path: "products.attributes",
      populate: { path: "title", model: "Attribute" },
    });
  res.status(200).json(new ApiResponse("My Order.", order));
});

const updateOrder = asyncHandler(async (req, res) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("user")
    .populate({
      path: "products.product",
      model: "Product",
    });
  const data = await orderModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  const products = [];
  Array.isArray(order.products)
    ? order.products.map((item) => products.push(item.product.title))
    : products.push(order.products.product.title);
  products, req.body.status;
  await emailConfig(
    order.user.email,
    `Your order is ${req.body.status}`,
    OrderStatusChange(order.user.fullname, products, req.body.status)
  );
  res.status(202).json(new ApiResponse("Update Order Status.", data));
});

module.exports = { postOrder, allOrder, userOrder, updateOrder };
